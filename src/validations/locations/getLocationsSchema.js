import { Joi, Segments } from 'celebrate';

// Власник: M4. Поки це заглушка, яка пропускає все. Заміни на реальні правила:
// page, limit, region (slug), type (slug), search (string), sort ('name' | '-name')
export const getLocationsSchema = {
  [Segments.QUERY]: Joi.object().unknown(true),
};
