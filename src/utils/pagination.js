// Спільний формат списків за контрактом:
// {"page":1,"limit":10,"totalItems":125,"totalPages":13,"items":[]}
import {
  DEFAULT_LIMIT,
  DEFAULT_PAGE,
  MAX_LIMIT,
} from '../constants/pagination.js';

export const getPaginationParams = (query = {}) => {
  const page = Math.max(Number(query.page) || DEFAULT_PAGE, 1);
  const limit = Math.min(
    Math.max(Number(query.limit) || DEFAULT_LIMIT, 1),
    MAX_LIMIT,
  );
  return { page, limit, skip: (page - 1) * limit };
};

export const buildPaginatedResponse = ({ items, totalItems, page, limit }) => ({
  page,
  limit,
  totalItems,
  totalPages: Math.ceil(totalItems / limit),
  items,
});
