import { nominatimRequest } from '../../services/geocode/nominatim.js';

// GET /api/geocode/search?q= — public, EXTRA. Пошук місця за назвою (лише Україна).
export const searchPlaces = async (req, res, next) => {
  try {
    const results = await nominatimRequest('/search', {
      q: req.query.q,
      countrycodes: 'ua',
      limit: 5,
    });

    const data = results.map(({ display_name, lat, lon }) => ({
      name: display_name,
      lat: Number(lat),
      lon: Number(lon),
    }));

    res.status(200).json({ data });
  } catch (error) {
    next(error);
  }
};
