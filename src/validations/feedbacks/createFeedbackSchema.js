import { Joi, Segments } from 'celebrate';

// Власник: M10. Поки це заглушка, яка пропускає все. Заміни на реальні правила:
// locationId (ObjectId hex 24) required, rate 1–5 required, description 1–200 required
export const createFeedbackSchema = {
  [Segments.BODY]: Joi.object().unknown(true),
};
