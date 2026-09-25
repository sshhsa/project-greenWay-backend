// GET /api/categories — власник: M9
// Редагуєш ТІЛЬКИ цей файл (+ свій файл валідації/сервісу). Роутер уже підключений тімлідом.
// Приклад формату відповіді: res.status(200).json({ data: ... }) або buildPaginatedResponse(...)
export const getCategories = async (_req, res, next) => {
  try {
    // TODO(M9): реалізувати за docs/API_CONTRACT.md
    res.status(501).json({ status: 501, message: 'Not implemented: GET /api/categories' });
  } catch (error) {
    next(error);
  }
};
