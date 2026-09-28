import { Schema, model } from 'mongoose';

const regionSchema = new Schema(
  {
    region: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    level: {
      type: String,
      required: true,
    },
    note: {
      type: String,
      required: true,
    },
  },
  { timestamps: true, versionKey: false },
);

export const Region = model('Region', regionSchema, 'regions');