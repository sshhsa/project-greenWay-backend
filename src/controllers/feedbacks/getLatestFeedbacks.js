// GET /api/feedbacks — власник: M1
// Редагуєш ТІЛЬКИ цей файл (+ свій файл валідації/сервісу). Роутер уже підключений тімлідом.
// Приклад формату відповіді: res.status(200).json({ data: ... }) або buildPaginatedResponse(...)
import { Feedback } from '../../models/feedback.js';
import { buildPaginatedResponse } from '../../utils/pagination.js';

export const getLatestFeedbacks = async (req, res, next) => {
  try {
    const page = Number(req.query.page ?? 1);
    const limit = Number(req.query.limit ?? 6);

    const [items, totalItems] = await Promise.all([
      Feedback.find()
        .sort({ createdAt: -1, _id: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .populate('locationId', 'name'),
      Feedback.countDocuments(),
    ]);

    res
      .status(200)
      .json(buildPaginatedResponse({ items, totalItems, page, limit }));
  } catch (error) {
    next(error);
  }
};
