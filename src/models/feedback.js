import { Schema, model } from 'mongoose';

// Власник: M10. Налаштувати поля. Специфікація (seed feedbacks.json + рішення ментора):
//   rate         Number, required, 1–5
//   description  String, required, 1–200
//   userName     String, required, 2–32 (береться з req.user.name, не з форми)
//   locationId   ObjectId, ref 'Location' — у seed-відгуків його НЕМАЄ,
//                тому не required на рівні схеми (для нових відгуків — обов'язковий у валідації)
const feedbackSchema = new Schema({}, { timestamps: true, versionKey: false });

export const Feedback = model('Feedback', feedbackSchema, 'feedbacks');
