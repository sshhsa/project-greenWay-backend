import { Joi, Segments } from 'celebrate';

// EXTRA: PATCH /api/users/me — multipart/form-data: name (текст) + avatar (файл, опц.)
// Файл перевіряє multer (upload.js: jpg/png < 1MB); що є хоч щось для оновлення — контролер.
export const updateCurrentUserSchema = {
  [Segments.BODY]: Joi.object({
    name: Joi.string().trim().min(2).max(32),
  }),
};
