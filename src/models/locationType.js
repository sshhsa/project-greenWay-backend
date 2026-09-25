import { Schema, model } from 'mongoose';

// Власник: M9. Довідник (тільки читання). Поля з seed location_types.json:
//   type String, slug String (unique), shortDescription String
const locationTypeSchema = new Schema({}, { timestamps: true, versionKey: false });

export const LocationType = model('LocationType', locationTypeSchema, 'location_types');
