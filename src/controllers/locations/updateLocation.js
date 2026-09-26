// PATCH /api/locations/:locationId — власник: M8
// Редагуєш ТІЛЬКИ цей файл (+ свій файл валідації/сервісу). Роутер уже підключений тімлідом.
// Приклад формату відповіді: res.status(200).json({ data: ... }) або buildPaginatedResponse(...)
export const updateLocation = async (_req, res, next) => {
  try {
    // TODO(M8): реалізувати за docs/API_CONTRACT.md
    res.status(501).json({
      status: 501,
      message: 'Not implemented: PATCH /api/locations/:locationId',
    });
  } catch (error) {
    next(error);
  }
};
