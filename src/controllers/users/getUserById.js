// GET /api/users/:userId — власник: M2
// Редагуєш ТІЛЬКИ цей файл (+ свій файл валідації/сервісу). Роутер уже підключений тімлідом.
// Приклад формату відповіді: res.status(200).json({ data: ... }) або buildPaginatedResponse(...)
export const getUserById = async (_req, res, next) => {
  try {
    // TODO(M2): реалізувати за docs/API_CONTRACT.md
    res.status(501).json({ status: 501, message: 'Not implemented: GET /api/users/:userId' });
  } catch (error) {
    next(error);
  }
};
