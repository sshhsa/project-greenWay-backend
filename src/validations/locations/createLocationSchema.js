import { Joi, Segments } from 'celebrate';

// Власник: M7. Поки це заглушка, яка пропускає все. Заміни на реальні правила:
// name 3–96, type ≤64, region ≤64, description 20–6000 (усі required); файл перевіряє upload.js
export const createLocationSchema = {
  [Segments.BODY]: Joi.object().unknown(true),
};
