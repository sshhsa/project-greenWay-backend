// Створює тестового користувача для перевірки приватних ендпоінтів.
// Запуск: npm run seed:user
import 'dotenv/config';
import bcrypt from 'bcrypt';
import mongoose from 'mongoose';

import { connectMongoDB } from './connectMongoDB.js';
import { User } from '../models/user.js';

const TEST_USER = {
  name: 'Тестовий Мандрівник',
  email: process.env.TEST_USER_EMAIL || 'test@greenway.dev',
  password: process.env.TEST_USER_PASSWORD || 'Test12345',
};

const run = async () => {
  await connectMongoDB();
  const exists = await User.findOne({ email: TEST_USER.email });
  if (exists) {
    console.log(`ℹ️  ${TEST_USER.email} вже існує`);
  } else {
    await User.create({ ...TEST_USER, password: await bcrypt.hash(TEST_USER.password, 10) });
    console.log(`✅ Створено ${TEST_USER.email} / ${TEST_USER.password}`);
  }
  await mongoose.disconnect();
};

run().catch(async (error) => {
  console.error('❌', error);
  await mongoose.disconnect();
  process.exit(1);
});
