import { Location } from '../../models/location.js';
import { findPopularLocations } from './findPopularLocations.js';
import { LOCATION_SORT } from './locationSort.js';

// українська локаль, щоб «І», «Ї», «Є» сортувались правильно
const UK_COLLATION = { locale: 'uk' };

// TODO: Якщо сортування за назвою знадобиться в інших місцях, винести в окремий сервіс.
const findByName = (collection, filter, direction, skip, limit) =>
  collection
    .find(filter)
    .sort({ name: direction, _id: 1 })
    .collation(UK_COLLATION)
    .skip(skip)
    .limit(limit)
    .toArray();

// TODO: Якщо вибірка без сортування знадобиться в інших місцях, винести в окремий сервіс.
const findDefaultLocations = (collection, filter, skip, limit) =>
  collection.find(filter).skip(skip).limit(limit).toArray();

const findItems = (collection, filter, sort, skip, limit) => {
  switch (sort) {
    case LOCATION_SORT.RATING_ASC:
      return findPopularLocations({ filter, direction: 1, skip, limit });
    case LOCATION_SORT.RATING_DESC:
      return findPopularLocations({ filter, direction: -1, skip, limit });
    case LOCATION_SORT.NAME_ASC:
      return findByName(collection, filter, 1, skip, limit);
    case LOCATION_SORT.NAME_DESC:
      return findByName(collection, filter, -1, skip, limit);
    default:
      return findDefaultLocations(collection, filter, skip, limit);
  }
};

export const findLocationsPage = async ({ filter, sort, skip, limit }) => {
  // схема Location ще порожня, тому поки читаємо напряму з колекції.
  // після мерджу моделі перевести на Location.find(filter).lean().
  const collection = Location.collection;

  const [items, totalItems] = await Promise.all([
    findItems(collection, filter, sort, skip, limit),
    collection.countDocuments(filter),
  ]);

  return { items, totalItems };
};
