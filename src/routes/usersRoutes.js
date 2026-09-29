import { Router } from 'express';
import { celebrate } from 'celebrate';

import { authenticate } from '../middleware/authenticate.js';
import { isValidId } from '../middleware/isValidId.js';
import { upload } from '../middleware/upload.js';
import { getCurrentUser } from '../controllers/users/getCurrentUser.js';
import { getUserById } from '../controllers/users/getUserById.js';
import { getUserLocations } from '../controllers/users/getUserLocations.js';
import { updateCurrentUser } from '../controllers/users/updateCurrentUser.js';
import { getUserLocationsSchema } from '../validations/users/getUserLocationsSchema.js';
import { updateCurrentUserSchema } from '../validations/users/updateCurrentUserSchema.js';

// Базовий шлях: /api/users — файл редагує ТІЛЬКИ тімлід
const router = Router();

router.get('/me', authenticate, getCurrentUser); // M1
router.patch(
  '/me',
  authenticate,
  upload.single('avatar'),
  celebrate(updateCurrentUserSchema),
  updateCurrentUser,
); // EXTRA
router.get('/:userId', isValidId('userId'), getUserById); // M2
router.get(
  '/:userId/locations',
  isValidId('userId'),
  celebrate(getUserLocationsSchema),
  getUserLocations,
); // M3

export default router;
