// GET /api/locations/popular — власник: M5
// Редагуєш ТІЛЬКИ цей файл (+ свій файл валідації/сервісу). Роутер уже підключений тімлідом.
// Приклад формату відповіді: res.status(200).json({ data: ... }) або buildPaginatedResponse(...)
// TODO(M5): Перед реалізацією переглянути src/services/locations/findPopularLocations.js.
// Сервіс сортує за кількістю feedbacksId, а API_CONTRACT.md поки вказує rate desc.
// Узгодити критерій популярності перед повторним використанням сервісу.
export const getPopularLocations = async (_req, res, next) => {
  try {
    // TODO(M5): реалізувати за docs/API_CONTRACT.md
    res.status(501).json({ status: 501, message: 'Not implemented: GET /api/locations/popular' });
  } catch (error) {
    next(error);
  }
};
