import { buildLocationFilter } from '../../services/locations/buildLocationFilter.js';
import { findLocationsPage } from '../../services/locations/findLocationsPage.js';
import {
  buildPaginatedResponse,
  getPaginationParams,
} from '../../utils/pagination.js';

export const getLocations = async (req, res, next) => {
  try {
    const { page, limit, skip } = getPaginationParams(req.query);
    const filter = buildLocationFilter(req.query);
    const { items, totalItems } = await findLocationsPage({
      filter,
      sort: req.query.sort,
      order: req.query.order,
      skip,
      limit,
    });

    res
      .status(200)
      .json(buildPaginatedResponse({ items, totalItems, page, limit }));
  } catch (error) {
    next(error);
  }
};
