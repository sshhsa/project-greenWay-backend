import { Joi, Segments } from 'celebrate';

import { coordinatesSchema } from './coordinatesSchema.js';

export const updateLocationSchema = {
  [Segments.BODY]: Joi.object({
    name: Joi.string().trim().min(3).max(96),
    locationType: Joi.string().trim().max(64),
    region: Joi.string().trim().max(64),
    description: Joi.string().trim().min(20).max(6000),

    coordinates: coordinatesSchema.optional(),
  }).unknown(true),
};
