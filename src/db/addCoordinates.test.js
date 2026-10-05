import assert from 'node:assert/strict';
import { test } from 'node:test';
import fs from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { backfillCoordinates, runBackfill } from './addCoordinates.js';

const coordinates = { lat: 48.1, lon: 24.5 };
test('CLI exits non-zero with no database URL and does not expose secrets', () => {
  const result = spawnSync(
    process.execPath,
    [fileURLToPath(new URL('./addCoordinates.js', import.meta.url))],
    {
      env: { ...process.env, MONGO_URL: '', MONGO_DNS_SERVER: '' },
      encoding: 'utf8',
      timeout: 10000,
    },
  );
  assert.equal(result.error, undefined);
  assert.equal(result.status, 1);
  assert.match(result.stderr, /підключення до БД/);
  assert.equal(result.stderr.includes('mongodb://'), false);
});
const collectionFor = (docs, beforeUpdate = () => {}) => ({
  async updateMany(filter, update, options) {
    assert.deepEqual(filter.coordinates, { $exists: Boolean(filter.$or) });
    if (filter.$or)
      assert.deepEqual(filter.$or, [
        { 'coordinates.lat': { $ne: update.$set.coordinates.lat } },
        { 'coordinates.lon': { $ne: update.$set.coordinates.lon } },
      ]);
    assert.deepEqual(Object.keys(update), ['$set']);
    assert.deepEqual(Object.keys(update.$set), ['coordinates']);
    assert.deepEqual(options, {
      collation: { locale: 'simple' },
      upsert: false,
    });
    beforeUpdate();
    let modifiedCount = 0;
    for (const doc of docs) {
      if (
        doc.name === filter.name &&
        (filter.$or
          ? Object.hasOwn(doc, 'coordinates') &&
            (doc.coordinates?.lat !== update.$set.coordinates.lat ||
              doc.coordinates?.lon !== update.$set.coordinates.lon)
          : !Object.hasOwn(doc, 'coordinates'))
      ) {
        doc.coordinates = structuredClone(update.$set.coordinates);
        modifiedCount++;
      }
    }
    return { modifiedCount };
  },
  async countDocuments({ name }) {
    return docs.filter((doc) => doc.name === name).length;
  },
});

test('updates missing coordinates, preserves other fields and is idempotent with duplicates', async () => {
  const docs = [{ name: 'Place', region: 'region' }, { name: 'Place' }];
  const seeds = [
    { name: 'Place', coordinates },
    { name: 'Place', coordinates: { lat: 0, lon: 0 } },
  ];
  const collection = collectionFor(docs);
  assert.equal((await backfillCoordinates(collection, seeds)).added, 2);
  assert.deepEqual(docs[0], { name: 'Place', region: 'region', coordinates });
  const snapshot = structuredClone(docs);
  assert.equal((await backfillCoordinates(collection, seeds)).added, 0);
  assert.deepEqual(docs, snapshot);
});

test('preserves existing, null, empty and partial coordinates', async () => {
  const docs = [coordinates, null, {}, { lat: 1 }].map((value) => ({
    name: 'Place',
    coordinates: value,
  }));
  const snapshot = structuredClone(docs);
  assert.deepEqual(
    await backfillCoordinates(collectionFor(docs), [
      { name: 'Place', coordinates },
    ]),
    {
      added: 0,
      updated: 0,
      unchanged: 0,
      skipped: 4,
      notFound: 0,
      invalid: 0,
    },
  );
  assert.deepEqual(docs, snapshot);
});

test('skips unknown names and matches names exactly', async () => {
  const docs = [{ name: 'place' }];
  assert.equal(
    (
      await backfillCoordinates(collectionFor(docs), [
        { name: 'Place', coordinates },
      ])
    ).notFound,
    1,
  );
  assert.deepEqual(docs, [{ name: 'place' }]);
});

test('skips invalid coordinates and accepts geographic boundaries', async () => {
  const invalid = [
    undefined,
    null,
    {},
    { lat: '1', lon: 2 },
    { lat: NaN, lon: 2 },
    { lat: Infinity, lon: 2 },
    { lat: 91, lon: 0 },
    { lat: -91, lon: 0 },
    { lat: 0, lon: 181 },
    { lat: 0, lon: -181 },
  ];
  const docs = [{ name: 'Place' }, { name: 'Other' }];
  const seeds = invalid.map((value) => ({ name: 'Place', coordinates: value }));
  seeds.push(
    null,
    { name: '', coordinates },
    { name: 'Place', coordinates: { lat: -90, lon: -180 } },
    { name: 'Other', coordinates: { lat: 90, lon: 180 } },
  );
  const summary = await backfillCoordinates(collectionFor(docs), seeds);
  assert.equal(summary.invalid, 12);
  assert.equal(summary.added, 2);
});

test('atomic predicate protects coordinates written by another process', async () => {
  const docs = [{ name: 'Place' }];
  const existing = { lat: 1, lon: 2 };
  const collection = collectionFor(docs, () => {
    docs[0].coordinates = existing;
  });
  assert.equal(
    (await backfillCoordinates(collection, [{ name: 'Place', coordinates }]))
      .added,
    0,
  );
  assert.deepEqual(docs[0].coordinates, existing);
});

test('connection and update failures close the connection and redact secrets', async () => {
  for (const stage of ['connect', 'update', 'read']) {
    let closed = false;
    const errors = [];
    const failure = () => {
      throw new Error('mongodb://user:secret@host/private');
    };
    const ok = await runBackfill({
      connect: stage === 'connect' ? failure : async () => {},
      disconnect: async () => {
        closed = true;
      },
      readSeeds:
        stage === 'read'
          ? failure
          : async () => [{ name: 'Place', coordinates }],
      getCollection: () => ({ updateMany: failure }),
      logError: (...args) => errors.push(args),
    });
    assert.equal(ok, false);
    assert.equal(closed, true);
    assert.equal(JSON.stringify(errors).includes('secret'), false);
    if (stage === 'update') assert.match(JSON.stringify(errors), /Place/);
  }
});

test('successful run closes the connection and reports summary', async () => {
  let closed = false;
  let summary;
  assert.equal(
    await runBackfill({
      connect: async () => {},
      disconnect: async () => {
        closed = true;
      },
      readSeeds: async () => [{ name: 'Place', coordinates }],
      getCollection: () => collectionFor([{ name: 'Place' }]),
      log: (value) => {
        summary = value;
      },
    }),
    true,
  );
  assert.equal(closed, true);
  assert.match(summary, /Додано: 1/);
});

test('all 90 seeds have finite coordinates in valid ranges', async () => {
  const seeds = JSON.parse(
    await fs.readFile(
      new URL('./seeds/locations.json', import.meta.url),
      'utf8',
    ),
  );
  assert.equal(seeds.length, 90);
  for (const { coordinates: value } of seeds) {
    assert.ok(
      Number.isFinite(value.lat) && value.lat >= -90 && value.lat <= 90,
    );
    assert.ok(
      Number.isFinite(value.lon) && value.lon >= -180 && value.lon <= 180,
    );
  }
});

for (const value of [
  { lat: 1, lon: 2 },
  { lat: 48.1, lon: 2 },
  { lat: 1, lon: 24.5 },
  null,
  {},
  { lat: 1 },
]) {
  test(
    'force replaces differing coordinates ' + JSON.stringify(value),
    async () => {
      const doc = {
        name: 'Place',
        region: 'region',
        description: 'description',
        rate: 4,
        coordinates: value,
      };
      const expected = { ...structuredClone(doc), coordinates };
      const summary = await backfillCoordinates(
        collectionFor([doc]),
        [{ name: 'Place', coordinates }],
        { force: true },
      );
      assert.equal(summary.updated, 1);
      assert.equal(summary.added, 0);
      assert.deepEqual(doc, expected);
    },
  );
}
test('force adds missing coordinates and preserves identical coordinates on repeated runs', async () => {
  const docs = [
    { name: 'Place', region: 'region' },
    { name: 'Place', coordinates },
  ];
  const collection = collectionFor(docs);
  const seeds = [{ name: 'Place', coordinates }];
  assert.deepEqual(
    await backfillCoordinates(collection, seeds, { force: true }),
    {
      added: 1,
      updated: 0,
      unchanged: 1,
      skipped: 0,
      notFound: 0,
      invalid: 0,
    },
  );
  assert.deepEqual(docs[0], { name: 'Place', region: 'region', coordinates });
  assert.equal(docs[1].coordinates, coordinates);
  const snapshot = structuredClone(docs);
  const summary = await backfillCoordinates(collection, seeds, { force: true });
  assert.equal(docs[1].coordinates, coordinates);
  assert.equal(summary.unchanged, 2);
  assert.equal(summary.updated, 0);
  assert.equal(summary.added, 0);
  assert.deepEqual(docs, snapshot);
});
test('runBackfill passes force and reports updated and unchanged records', async () => {
  const docs = [
    { name: 'Place', coordinates: { lat: 1, lon: 2 } },
    { name: 'Place', coordinates },
  ];
  let summary;
  assert.equal(
    await runBackfill({
      force: true,
      connect: async () => {},
      disconnect: async () => {},
      readSeeds: async () => [{ name: 'Place', coordinates }],
      getCollection: () => collectionFor(docs),
      log: (value) => {
        summary = value;
      },
    }),
    true,
  );
  assert.match(summary, /оновлено: 1; без змін: 1/);
});
