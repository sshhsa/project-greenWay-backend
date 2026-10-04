import { Joi, Segments } from 'celebrate';

// EXTRA: GET /api/geocode/search?q= | GET /api/geocode/reverse?lat=&lon=
export const searchPlacesSchema = {
  [Segments.QUERY]: Joi.object({
    q: Joi.string().trim().min(2).max(120).required(),
  }),
};

export const reversePlaceSchema = {
  [Segments.QUERY]: Joi.object({
    lat: Joi.number().min(-90).max(90).required(),
    lon: Joi.number().min(-180).max(180).required(),
  }),
};
