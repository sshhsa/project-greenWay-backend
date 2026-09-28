import { Schema, model } from 'mongoose';

const locationTypeSchema = new Schema(
  {
    type: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    shortDescription: {
      type: String,
      required: true,
    },
  },
  { timestamps: true, versionKey: false },
);

export const LocationType = model(
  'LocationType',
  locationTypeSchema,
  'location_types',
);