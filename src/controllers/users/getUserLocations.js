// GET /api/users/:userId/locations — власник: M3
// Редагуєш ТІЛЬКИ цей файл (+ свій файл валідації/сервісу). Роутер уже підключений тімлідом.
// Приклад формату відповіді: res.status(200).json({ data: ... }) або buildPaginatedResponse(...)
export const getUserLocations = async (_req, res, next) => {
  try {
    // TODO(M3): реалізувати за docs/API_CONTRACT.md
    res.status(501).json({ status: 501, message: 'Not implemented: GET /api/users/:userId/locations' });
  } catch (error) {
    next(error);
  }
};
