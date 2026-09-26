// POST /api/locations — власник: M7
// Редагуєш ТІЛЬКИ цей файл (+ свій файл валідації/сервісу). Роутер уже підключений тімлідом.
// Приклад формату відповіді: res.status(200).json({ data: ... }) або buildPaginatedResponse(...)
export const createLocation = async (_req, res, next) => {
  try {
    // TODO(M7): реалізувати за docs/API_CONTRACT.md
    res
      .status(501)
      .json({ status: 501, message: 'Not implemented: POST /api/locations' });
  } catch (error) {
    next(error);
  }
};
