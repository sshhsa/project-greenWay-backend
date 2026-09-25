// GET /api/locations/:locationId — власник: M6
// Редагуєш ТІЛЬКИ цей файл (+ свій файл валідації/сервісу). Роутер уже підключений тімлідом.
// Приклад формату відповіді: res.status(200).json({ data: ... }) або buildPaginatedResponse(...)
export const getLocationById = async (_req, res, next) => {
  try {
    // TODO(M6): реалізувати за docs/API_CONTRACT.md
    res.status(501).json({ status: 501, message: 'Not implemented: GET /api/locations/:locationId' });
  } catch (error) {
    next(error);
  }
};
