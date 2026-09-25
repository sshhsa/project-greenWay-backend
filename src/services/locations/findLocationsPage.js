import { Location } from '../../models/location.js';
import { findPopularLocations } from './findPopularLocations.js';
import { LOCATION_SORT, LOCATION_SORT_ORDER } from './locationSort.js';

const findRatedLocations = (collection, filter, direction, skip, limit) =>
  collection
    .find(filter)
    .sort({ rate: direction, _id: 1 })
    .skip(skip)
    .limit(limit)
    .toArray();

const findUnsortedLocations = (collection, filter, skip, limit) =>
  collection.find(filter).skip(skip).limit(limit).toArray();

export const findLocationsPage = async ({
  filter,
  sort,
  order,
  skip,
  limit,
}) => {
  // The shared Location schema is still a placeholder; the native collection
  // preserves all fields imported from the MongoDB seed documents.
  const collection = Location.collection;
  const direction = order === LOCATION_SORT_ORDER.ASC ? 1 : -1;
  let itemsQuery;

  switch (sort) {
    case LOCATION_SORT.POPULAR:
      itemsQuery = findPopularLocations({ filter, direction, skip, limit });
      break;
    case LOCATION_SORT.RATING:
      itemsQuery = findRatedLocations(
        collection,
        filter,
        direction,
        skip,
        limit,
      );
      break;
    default:
      itemsQuery = findUnsortedLocations(collection, filter, skip, limit);
  }

  const [items, totalItems] = await Promise.all([
    itemsQuery,
    collection.countDocuments(filter),
  ]);

  return { items, totalItems };
};
