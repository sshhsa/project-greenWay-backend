import { reversePlaceService } from '../../services/geocode/geocoder.js';

// GET /api/geocode/reverse?lat=&lon= — public, EXTRA. Назва місця за координатами (клік по карті).
export const reversePlace = async (req, res, next) => {
  try {
    const lat = Number(req.query.lat);
    const lon = Number(req.query.lon);
    const name = await reversePlaceService(lat, lon);
    res.status(200).json({ data: { name, lat, lon } });
  } catch (error) {
    next(error);
  }
};
