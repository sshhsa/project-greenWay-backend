import { Router } from 'express';

import authRouter from './authRoutes.js';
import usersRouter from './usersRoutes.js';
import locationsRouter from './locationsRoutes.js';
import categoriesRouter from './categoriesRoutes.js';
import feedbacksRouter from './feedbacksRoutes.js';
import geocodeRouter from './geocodeRoutes.js';

const router = Router();

router.use('/auth', authRouter);
router.use('/users', usersRouter);
router.use('/locations', locationsRouter);
router.use('/categories', categoriesRouter);
router.use('/feedbacks', feedbacksRouter);
router.use('/geocode', geocodeRouter);

export default router;
