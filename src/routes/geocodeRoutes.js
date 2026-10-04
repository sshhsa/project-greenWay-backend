import { Router } from 'express';
import { celebrate } from 'celebrate';

import { searchPlaces } from '../controllers/geocode/searchPlaces.js';
import { reversePlace } from '../controllers/geocode/reversePlace.js';
import {
  searchPlacesSchema,
  reversePlaceSchema,
} from '../validations/geocode/geocodeSchemas.js';

// Базовий шлях: /api/geocode — файл редагує ТІЛЬКИ тімлід
const router = Router();

router.get('/search', celebrate(searchPlacesSchema), searchPlaces); // EXTRA
router.get('/reverse', celebrate(reversePlaceSchema), reversePlace); // EXTRA

export default router;
