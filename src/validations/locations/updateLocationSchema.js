import { Joi, Segments } from 'celebrate';

export const updateLocationSchema = {
  [Segments.BODY]: Joi.object({
    name: Joi.string().trim().min(3).max(96),
    locationType: Joi.string().trim().max(64),
    region: Joi.string().trim().max(64),
    description: Joi.string().trim().min(20).max(6000),

    coordinates: Joi.object({
      lat: Joi.number().min(-90).max(90).required(),
      lon: Joi.number().min(-180).max(180).required(),
    }).optional(),
  }).unknown(true),
};