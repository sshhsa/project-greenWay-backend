// POST /api/feedbacks — власник: M10
// Редагуєш ТІЛЬКИ цей файл (+ свій файл валідації/сервісу). Роутер уже підключений тімлідом.
// Приклад формату відповіді: res.status(200).json({ data: ... }) або buildPaginatedResponse(...)
export const createFeedback = async (_req, res, next) => {
  try {
    // TODO(M10): реалізувати за docs/API_CONTRACT.md
    res.status(501).json({ status: 501, message: 'Not implemented: POST /api/feedbacks' });
  } catch (error) {
    next(error);
  }
};
