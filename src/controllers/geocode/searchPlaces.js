import { searchPlacesService } from '../../services/geocode/geocoder.js';

// GET /api/geocode/search?q= — public, EXTRA. Пошук місця за назвою (лише Україна).
export const searchPlaces = async (req, res, next) => {
  try {
    const data = await searchPlacesService(req.query.q);
    res.status(200).json({ data });
  } catch (error) {
    next(error);
  }
};
