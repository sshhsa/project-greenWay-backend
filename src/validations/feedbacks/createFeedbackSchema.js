import { Joi, Segments } from 'celebrate';

// Власник: M10. Поки це заглушка, яка пропускає все. Заміни на реальні правила:
// locationId (ObjectId hex 24) required, rate 1–5 required, description 1–200 required
export const createFeedbackSchema = {
  [Segments.BODY]: Joi.object({
  locationId: Joi.string().hex().length(24).required(),
  rate: Joi.number().min(1).max(5).required(),
  description: Joi.string().trim().min(1).max(200).required(),
}),
};
