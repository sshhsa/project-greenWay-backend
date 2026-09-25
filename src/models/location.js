import { Schema, model } from 'mongoose';

// Власник: M7. Налаштувати поля. Специфікація (seed locations.json + ТЗ Validation rules):
//   name          String, required, trim, 3–96
//   image         String (URL з Cloudinary), required
//   locationType  String — SLUG типу (напр. 'more'), required
//   region        String — SLUG регіону (напр. 'odeshchyna'), required
//   description   String, required, 20–6000
//   rate          Number, default: 0 (середнє з відгуків — перераховує M10)
//   ownerId       ObjectId, ref 'User', required
//   feedbacksId   [ObjectId], ref 'Feedback', default: []
//   coordinates   { lat: Number, lon: Number } — НЕ обов'язкове (карта = додаткове завдання)
// Індекс для пошуку/фільтрів: { name: 'text' } або regex по name; індекси на region, locationType.
const locationSchema = new Schema({}, { timestamps: true, versionKey: false });

export const Location = model('Location', locationSchema, 'locations');
