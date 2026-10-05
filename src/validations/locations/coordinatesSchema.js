import { Joi } from 'celebrate';

// multipart/form-data передає coordinates рядком '{"lat":..,"lon":..}' —
// розбираємо JSON до валідації, а результат (вже об'єкт) celebrate кладе назад у req.body.
const coordinatesObject = Joi.object({
  lat: Joi.number().min(-90).max(90).required(),
  lon: Joi.number().min(-180).max(180).required(),
});

export const coordinatesSchema = Joi.alternatives().try(
  coordinatesObject,
  Joi.string()
    .trim()
    .custom((value, helpers) => {
      let parsed;
      try {
        parsed = JSON.parse(value);
      } catch {
        return helpers.error('any.invalid');
      }
      const { error, value: coordinates } = coordinatesObject.validate(parsed);
      return error ? helpers.error('any.invalid') : coordinates;
    })
    .messages({
      'any.invalid': '"coordinates" must be JSON with numeric lat and lon',
    }),
);
