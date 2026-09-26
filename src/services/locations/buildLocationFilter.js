import { LOCATION_FILTER } from './locationFilter.js';

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

export const buildLocationFilter = (query) => {
  const region = query[LOCATION_FILTER.REGION];
  const type = query[LOCATION_FILTER.TYPE];
  const search = query[LOCATION_FILTER.SEARCH];

  return {
    ...(region ? { region } : {}),
    ...(type ? { locationType: type } : {}),
    ...(search ? { name: { $regex: escapeRegex(search), $options: 'i' } } : {}),
  };
};
