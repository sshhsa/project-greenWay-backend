import { Schema, model } from 'mongoose';

// Власник: M9. Довідник (тільки читання). Поля з seed regions.json:
//   region String, slug String (unique), level String, note String
const regionSchema = new Schema({}, { timestamps: true, versionKey: false });

export const Region = model('Region', regionSchema, 'regions');
