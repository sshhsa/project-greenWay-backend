import { Joi, Segments } from 'celebrate';

// Власник: M8. Поки це заглушка, яка пропускає все. Заміни на реальні правила:
// ті самі поля, що в create, але НЕ required; .min(1) якщо немає файлу
export const updateLocationSchema = {
  [Segments.BODY]: Joi.object().unknown(true),
};
