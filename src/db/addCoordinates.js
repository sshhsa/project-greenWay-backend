import 'dotenv/config';
import fs from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import mongoose from 'mongoose';
import { connectMongoDB } from './connectMongoDB.js';

export const backfillCoordinates = async (collection, seeds) => {
  const summary = { updated: 0, existing: 0, notFound: 0, invalid: 0 };
  for (const seed of seeds) {
    const { name, coordinates } = seed ?? {};
    if (
      typeof name !== 'string' ||
      !name.trim() ||
      !Number.isFinite(coordinates?.lat) ||
      !Number.isFinite(coordinates?.lon) ||
      coordinates.lat < -90 ||
      coordinates.lat > 90 ||
      coordinates.lon < -180 ||
      coordinates.lon > 180
    ) {
      summary.invalid++;
      continue;
    }
    try {
      const result = await collection.updateMany(
        { name, coordinates: { $exists: false } },
        {
          $set: { coordinates: { lat: coordinates.lat, lon: coordinates.lon } },
        },
        { collation: { locale: 'simple' }, upsert: false },
      );
      summary.updated += result.modifiedCount;
      const existing = await collection.countDocuments(
        { name },
        { collation: { locale: 'simple' } },
      );
      if (existing === 0) summary.notFound++;
      else summary.existing += Math.max(0, existing - result.modifiedCount);
    } catch (error) {
      throw new Error(`Не вдалося оновити локацію ${JSON.stringify(name)}`, {
        cause: error,
      });
    }
  }
  return summary;
};

export const runBackfill = async ({
  connect = () => connectMongoDB({ throwOnError: true }),
  disconnect = () => mongoose.disconnect(),
  readSeeds = async () =>
    JSON.parse(
      await fs.readFile(
        new URL('./seeds/locations.json', import.meta.url),
        'utf8',
      ),
    ),
  getCollection = () => mongoose.connection.db.collection('locations'),
  log = console.log,
  logError = console.error,
} = {}) => {
  let stage = 'читання seed';
  try {
    const seeds = await readSeeds();
    if (!Array.isArray(seeds)) throw new TypeError('Seed має бути масивом');
    stage = 'підключення до БД';
    await connect();
    stage = 'оновлення координат';
    const summary = await backfillCoordinates(getCollection(), seeds);
    log(
      `Оновлено: ${summary.updated}; вже мають координати: ${summary.existing}; не знайдено: ${summary.notFound}; невалідні seed: ${summary.invalid}`,
    );
    return true;
  } catch (error) {
    logError(
      `Помилка (${stage}): ${error.cause ? error.message : 'операцію не виконано'}`,
      {
        type: error.cause?.name ?? error.name,
        code:
          typeof (error.cause?.code ?? error.code) === 'number'
            ? (error.cause?.code ?? error.code)
            : undefined,
      },
    );
    return false;
  } finally {
    try {
      await disconnect();
    } catch {
      logError('Не вдалося закрити підключення до БД');
      process.exitCode = 1;
    }
  }
};

if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href
) {
  if (!(await runBackfill())) process.exitCode = 1;
}
