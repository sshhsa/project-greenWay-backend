import { Joi, Segments } from 'celebrate';
import { LOCATION_FILTER } from '../../services/locations/locationFilter.js';
import {
  LOCATION_SORT,
  LOCATION_SORT_ORDER,
} from '../../services/locations/locationSort.js';

export const getLocationsSchema = {
  [Segments.QUERY]: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(50).default(10),
    [LOCATION_FILTER.REGION]: Joi.string().trim().min(1).max(96),
    [LOCATION_FILTER.TYPE]: Joi.string().trim().min(1).max(96),
    [LOCATION_FILTER.SEARCH]: Joi.string().trim().max(96).allow(''),
    sort: Joi.string().valid(...Object.values(LOCATION_SORT)),
    order: Joi.string().valid(...Object.values(LOCATION_SORT_ORDER)),
  })
    .with('order', 'sort')
    .unknown(false),
};
