// GET /api/users/me — власник: M1
// Редагуєш ТІЛЬКИ цей файл (+ свій файл валідації/сервісу). Роутер уже підключений тімлідом.
// Приклад формату відповіді: res.status(200).json({ data: ... }) або buildPaginatedResponse(...)
export const getCurrentUser = async (_req, res, next) => {
  try {
    // TODO(M1): реалізувати за docs/API_CONTRACT.md
    res.status(501).json({ status: 501, message: 'Not implemented: GET /api/users/me' });
  } catch (error) {
    next(error);
  }
};
