import { Location } from '../../models/location.js';
import { LOCATION_SORT, LOCATION_SORT_ORDER } from './locationSort.js';

// українська локаль, щоб «І», «Ї», «Є» сортувались правильно
const UK_COLLATION = { locale: 'uk' };

const getSortStage = (sort, order) => {
  switch (sort) {
    case LOCATION_SORT.NAME_ASC:
      return { name: 1, _id: 1 };
    case LOCATION_SORT.NAME_DESC:
      return { name: -1, _id: 1 };
    case LOCATION_SORT.RATING:
      return { rate: order === LOCATION_SORT_ORDER.ASC ? 1 : -1, _id: 1 };
    default:
      return null; // без sort — порядок як у БД
  }
};

export const findLocationsPage = async ({
  filter,
  sort,
  order,
  skip,
  limit,
}) => {
  // схема Location ще порожня, тому поки читаємо напряму з колекції.
  // після мерджу моделі перевести на Location.find(filter).lean().
  const collection = Location.collection;
  const sortStage = getSortStage(sort, order);

  let cursor = collection.find(filter);
  if (sortStage) cursor = cursor.sort(sortStage).collation(UK_COLLATION);

  const [items, totalItems] = await Promise.all([
    cursor.skip(skip).limit(limit).toArray(),
    collection.countDocuments(filter),
  ]);

  return { items, totalItems };
};
