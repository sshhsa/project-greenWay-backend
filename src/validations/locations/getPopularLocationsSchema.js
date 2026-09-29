import { Joi, Segments } from 'celebrate';

export const getPopularLocationsSchema = {
  [Segments.QUERY]: Joi.object({
    limit: Joi.number().integer().min(1).max(20).default(6),
  }),
};
