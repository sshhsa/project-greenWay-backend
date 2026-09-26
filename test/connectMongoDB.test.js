import assert from 'node:assert/strict';
import dns from 'node:dns';
import { test } from 'node:test';
import mongoose from 'mongoose';
import { connectMongoDB } from '../src/db/connectMongoDB.js';

for (const configured of [undefined, '', '1.1.1.1']) {
  test(`MongoDB connection respects DNS setting ${configured ?? 'unset'}`, async (t) => {
    const previous = process.env.MONGO_DNS_SERVER;
    t.after(() => {
      if (previous === undefined) delete process.env.MONGO_DNS_SERVER;
      else process.env.MONGO_DNS_SERVER = previous;
    });
    if (configured === undefined) delete process.env.MONGO_DNS_SERVER;
    else process.env.MONGO_DNS_SERVER = configured;
    const calls = [];
    t.mock.method(dns, 'setServers', (servers) => calls.push(['dns', servers]));
    t.mock.method(mongoose, 'connect', async (url) => {
      assert.equal(url, process.env.MONGO_URL);
      calls.push(['connect']);
    });
    t.mock.method(console, 'log', () => {});
    await connectMongoDB();
    assert.deepEqual(
      calls,
      configured ? [['dns', [configured]], ['connect']] : [['connect']],
    );
  });
}
