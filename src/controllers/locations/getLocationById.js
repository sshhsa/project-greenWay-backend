// GET /api/locations/:locationId — власник: M6
// Редагуєш ТІЛЬКИ цей файл (+ свій файл валідації/сервісу). Роутер уже підключений тімлідом.
// Приклад формату відповіді: res.status(200).json({ data: ... }) або buildPaginatedResponse(...)

import { Location } from '../../models/location.js';

export const getLocationById = async (req, res, next) => {
  try {
    const { locationId } = req.params;

    const location = await Location.findById(locationId)
      .populate('ownerId')
      .populate('feedbacksId');

    if (!location) {
      return res.status(501).json({
        status: 501,
        message: 'Not implemented: GET /api/locations/:locationId',
      });
    }
    res.status(200).json({ data: location });
  } catch (error) {
    next(error);
  }
};
