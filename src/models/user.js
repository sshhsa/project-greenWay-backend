import { Schema, model } from 'mongoose';

// email/password НЕ required на рівні схеми: seed-користувачі (автори з ТЗ) їх не мають.
// Для нових користувачів обов'язковість гарантує валідація реєстрації (celebrate).
const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 32,
    },
    email: {
      type: String,
      unique: true,
      sparse: true, // (!) без sparse unique-індекс впаде на seed-юзерах без email
      lowercase: true,
      trim: true,
      maxlength: 64,
    },
    password: { type: String },
    avatarUrl: { type: String, default: '' },
    articlesAmount: { type: Number, default: 0 },
  },
  { timestamps: true, versionKey: false },
);

userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

export const User = model('User', userSchema, 'users');
