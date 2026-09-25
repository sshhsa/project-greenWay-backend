// Перевірка ObjectId у params ДО запиту в БД → 400. Використання: isValidId('locationId')
import createHttpError from 'http-errors';
import { isValidObjectId } from 'mongoose';

export const isValidId =
  (paramName = 'id') =>
  (req, _res, next) => {
    if (!isValidObjectId(req.params[paramName])) {
      return next(createHttpError(400, `Invalid ${paramName}`));
    }
    next();
  };
