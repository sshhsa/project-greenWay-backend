import { Joi, Segments } from 'celebrate';

export const createLocationSchema = {
  [Segments.BODY]: Joi.object({
    name: Joi.string().trim().min(3).max(96).required(),
    locationType: Joi.string().trim().max(64).required(),
    region: Joi.string().trim().max(64).required(),
    description: Joi.string().trim().min(20).max(6000).required(),
  }).unknown(true),
};
