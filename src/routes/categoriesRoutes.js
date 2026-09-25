import { Router } from 'express';

import { getCategories } from '../controllers/categories/getCategories.js';

// Базовий шлях: /api/categories — файл редагує ТІЛЬКИ тімлід
const router = Router();

router.get('/', getCategories); // M9 → { data: { regions, locationTypes } }

export default router;
