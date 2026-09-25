// Наповнення БД початковими даними з ТЗ (Google Drive "Інформація для наповнення колекцій").
// 1) Завантаж 5 файлів relax_map_db.*.json у src/db/seeds/ і перейменуй без префікса:
//    regions.json, location_types.json, users.json, feedbacks.json, locations.json
// 2) npm run seed            — додає дані (якщо колекція порожня)
//    npm run seed -- --force — очищає колекції і заливає заново
// Файли у форматі MongoDB Extended JSON ({"$oid": ...}) — тому парсимо через EJSON,
// а вставляємо напряму в колекцію (seed-юзери не мають email/password → валідація схеми їх би відкинула).
import 'dotenv/config';
import fs from 'node:fs/promises';
import path from 'node:path';
import mongoose from 'mongoose';

import { connectMongoDB } from './connectMongoDB.js';

const { EJSON } = mongoose.mongo.BSON;
const FORCE = process.argv.includes('--force');

const SEEDS = [
  { file: 'regions.json', collection: 'regions' },
  { file: 'location_types.json', collection: 'location_types' },
  { file: 'users.json', collection: 'users' },
  { file: 'feedbacks.json', collection: 'feedbacks' },
  { file: 'locations.json', collection: 'locations' },
];

const seed = async () => {
  await connectMongoDB();
  const db = mongoose.connection.db;

  for (const { file, collection } of SEEDS) {
    const raw = await fs.readFile(path.resolve('src/db/seeds', file), 'utf-8');
    const docs = EJSON.parse(raw);
    const col = db.collection(collection);

    if (FORCE) await col.deleteMany({});
    if ((await col.countDocuments()) > 0) {
      console.log(`⏭  ${collection}: вже має дані — пропускаю (use --force)`);
      continue;
    }
    await col.insertMany(docs);
    console.log(`🌱 ${collection}: ${docs.length} docs`);
  }

  await mongoose.disconnect();
};

seed().catch(async (error) => {
  console.error('❌ Seeding failed:', error);
  await mongoose.disconnect();
  process.exit(1);
});
