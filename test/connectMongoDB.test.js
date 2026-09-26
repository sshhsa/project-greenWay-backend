import assert from 'node:assert/strict';
import dns from 'node:dns';
import test from 'node:test';
import mongoose from 'mongoose';

import { connectMongoDB } from '../src/db/connectMongoDB.js';

test('MongoDB connection uses configured DNS and preserves defaults otherwise', async () => {
  const originalServers = dns.getServers();
  const originalConnect = mongoose.connect;
  const originalDnsServer = process.env.MONGO_DNS_SERVER;
  const originalMongoUrl = process.env.MONGO_URL;

  try {
    process.env.MONGO_URL = 'mongodb+srv://example.mongodb.net/test';
    mongoose.connect = async (url) => {
      assert.equal(url, process.env.MONGO_URL);
    };

    dns.setServers(['127.0.0.1']);
    process.env.MONGO_DNS_SERVER = '1.1.1.1';
    await connectMongoDB();
    assert.deepEqual(dns.getServers(), ['1.1.1.1']);

    dns.setServers(['127.0.0.1']);
    delete process.env.MONGO_DNS_SERVER;
    await connectMongoDB();
    assert.deepEqual(dns.getServers(), ['127.0.0.1']);
  } finally {
    dns.setServers(originalServers);
    mongoose.connect = originalConnect;
    if (originalDnsServer === undefined) {
      delete process.env.MONGO_DNS_SERVER;
    } else {
      process.env.MONGO_DNS_SERVER = originalDnsServer;
    }
    if (originalMongoUrl === undefined) {
      delete process.env.MONGO_URL;
    } else {
      process.env.MONGO_URL = originalMongoUrl;
    }
  }
});
