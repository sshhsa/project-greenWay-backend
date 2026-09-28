import { Schema, model } from 'mongoose';

const feedbackSchema = new Schema(
  {
    rate: { type: Number, required: true, min: 1, max: 5 },
    description: {
      type: String,
      required: true,
      trim: true,
      minlength: 1,
      maxlength: 200,
    },
    userName: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 32,
    },
    // у seed-відгуків locationId немає, тому не required
    locationId: { type: Schema.Types.ObjectId, ref: 'Location' },
  },
  { timestamps: true, versionKey: false },
);

export const Feedback = model('Feedback', feedbackSchema, 'feedbacks');
