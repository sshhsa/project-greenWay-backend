import { Joi, Segments } from 'celebrate';

// Власник: M5. Поки це заглушка, яка пропускає все. Заміни на реальні правила:
// limit (int 1–20, default 6)
export const getPopularLocationsSchema = {
  [Segments.QUERY]: Joi.object().unknown(true),
};
