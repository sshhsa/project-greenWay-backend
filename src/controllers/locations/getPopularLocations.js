import { Location } from '../../models/location.js';

export const getPopularLocations = async (req, res, next) => {
  try {
    const { limit } = req.query;

    const locations = await Location.find().sort({ rate: -1 }).limit(limit);

    res.status(200).json({
      data: locations,
    });
  } catch (error) {
    next(error);
  }
};
