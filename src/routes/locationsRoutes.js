import { Router } from 'express';
import { celebrate } from 'celebrate';

import { authenticate } from '../middleware/authenticate.js';
import { isValidId } from '../middleware/isValidId.js';
import { upload } from '../middleware/upload.js';
import { getLocations } from '../controllers/locations/getLocations.js';
import { getPopularLocations } from '../controllers/locations/getPopularLocations.js';
import { getLocationById } from '../controllers/locations/getLocationById.js';
import { createLocation } from '../controllers/locations/createLocation.js';
import { updateLocation } from '../controllers/locations/updateLocation.js';
import { getLocationsSchema } from '../validations/locations/getLocationsSchema.js';
import { getPopularLocationsSchema } from '../validations/locations/getPopularLocationsSchema.js';
import { createLocationSchema } from '../validations/locations/createLocationSchema.js';
import { updateLocationSchema } from '../validations/locations/updateLocationSchema.js';

// Базовий шлях: /api/locations — файл редагує ТІЛЬКИ тімлід
const router = Router();

router.get('/', celebrate(getLocationsSchema), getLocations); // M4
router.get(
  '/popular',
  celebrate(getPopularLocationsSchema),
  getPopularLocations,
); // M5 (вище за /:locationId!)
router.get('/:locationId', isValidId('locationId'), getLocationById); // M6
router.post(
  '/',
  authenticate,
  upload.single('image'),
  celebrate(createLocationSchema),
  createLocation,
); // M7
router.patch(
  '/:locationId',
  authenticate,
  isValidId('locationId'),
  upload.single('image'),
  celebrate(updateLocationSchema),
  updateLocation,
); // M8

export default router;
