import { Joi, Segments } from 'celebrate';

// Власник: M3. Поки це заглушка, яка пропускає все. Заміни на реальні правила:
// page (int ≥1), limit (int 1–50)
export const getUserLocationsSchema = {
  [Segments.QUERY]: Joi.object().unknown(true),
};
