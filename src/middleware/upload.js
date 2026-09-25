// multer: файл у пам'яті → далі saveFileToCloudinary. ТЗ: jpg/png, < 1MB.
import multer from 'multer';
import createHttpError from 'http-errors';

const ALLOWED_TYPES = ['image/jpeg', 'image/png'];

export const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (ALLOWED_TYPES.includes(file.mimetype)) return cb(null, true);
    cb(createHttpError(400, 'Only jpg/png images are allowed'));
  },
});
