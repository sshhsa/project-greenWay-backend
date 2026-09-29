// GET /api/locations/:locationId — власник: M6
// Редагуєш ТІЛЬКИ цей файл (+ свій файл валідації/сервісу). Роутер уже підключений тімлідом.
// Приклад формату відповіді: res.status(200).json({ data: ... }) або buildPaginatedResponse(...)

import { Location } from '../../models/location.js';
import createHttpError from 'http-errors';

export const getLocationById = async (req, res, next) => {
  try {
    const { locationId } = req.params;

    const location = await Location.findById(locationId)
      .populate('ownerId', 'name avatarUrl')
      .populate('feedbacksId');

    if (!location) {
      throw createHttpError(404, 'Location not found');
    }
    res.status(200).json({ data: location });
  } catch (error) {
    next(error);
  }
};
