import { Location } from '../../models/location.js';

// TODO(M5): Використати цей сервіс у controllers/locations/getPopularLocations.js.
// Приклад імпорту: import { findPopularLocations } from '../../services/locations/findPopularLocations.js';
// Приклад виклику: const items = await findPopularLocations({ limit: 6 });
// За замовчуванням сортує за rate від більшого до меншого.
export const findPopularLocations = ({
  filter = {},
  direction = -1,
  skip = 0,
  limit,
}) =>
  Location.collection
    .find(filter)
    .sort({ rate: direction, _id: 1 })
    .skip(skip)
    .limit(limit)
    .toArray();
