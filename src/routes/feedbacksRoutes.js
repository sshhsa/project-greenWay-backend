import { Router } from 'express';
import { celebrate } from 'celebrate';

import { authenticate } from '../middleware/authenticate.js';
import { getLatestFeedbacks } from '../controllers/feedbacks/getLatestFeedbacks.js';
import { createFeedback } from '../controllers/feedbacks/createFeedback.js';
import { getLatestFeedbacksSchema } from '../validations/feedbacks/getLatestFeedbacksSchema.js';
import { createFeedbackSchema } from '../validations/feedbacks/createFeedbackSchema.js';

// Базовий шлях: /api/feedbacks — файл редагує ТІЛЬКИ тімлід
const router = Router();

router.get('/', celebrate(getLatestFeedbacksSchema), getLatestFeedbacks); // M1
router.post('/', authenticate, celebrate(createFeedbackSchema), createFeedback); // M10

export default router;
