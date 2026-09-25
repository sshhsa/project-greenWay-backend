import { Joi, Segments } from 'celebrate';

// Власник: M1. Поки це заглушка, яка пропускає все. Заміни на реальні правила:
// limit (int 1–20, default 6)
export const getLatestFeedbacksSchema = {
  [Segments.QUERY]: Joi.object().unknown(true),
};
