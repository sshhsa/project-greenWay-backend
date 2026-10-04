import { nominatimRequest } from '../../services/geocode/nominatim.js';

// GET /api/geocode/reverse?lat=&lon= — public, EXTRA. Назва місця за координатами (клік по карті).
export const reversePlace = async (req, res, next) => {
  try {
    const { lat, lon } = req.query;
    const result = await nominatimRequest('/reverse', { lat, lon });

    res.status(200).json({
      data: {
        name: result?.display_name ?? '',
        lat: Number(lat),
        lon: Number(lon),
      },
    });
  } catch (error) {
    next(error);
  }
};
