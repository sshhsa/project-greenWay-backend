// Єдиний формат помилок за контрактом: {"status":400,"message":"Validation error"}
import { isCelebrateError } from 'celebrate';
import { isHttpError } from 'http-errors';
import multer from 'multer';

export const errorHandler = (err, req, res, _next) => {
  if (isCelebrateError(err)) {
    const message = [...err.details.values()].map((e) => e.message).join('; ');
    return res.status(400).json({ status: 400, message: message || 'Validation error' });
  }

  if (err instanceof multer.MulterError) {
    const message = err.code === 'LIMIT_FILE_SIZE' ? 'File is too large (max 1MB)' : err.message;
    return res.status(400).json({ status: 400, message });
  }

  if (isHttpError(err)) {
    return res.status(err.status).json({ status: err.status, message: err.message });
  }

  req.log?.error(err);
  res.status(500).json({ status: 500, message: 'Internal server error' });
};
