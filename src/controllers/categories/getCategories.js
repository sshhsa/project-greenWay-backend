import { Region } from '../../models/region.js';
import { LocationType } from '../../models/locationType.js';

export const getCategories = async (_req, res, next) => {
  try {
    const [regions, locationTypes] = await Promise.all([
      Region.find().lean(),
      LocationType.find().lean(),
    ]);

    res.status(200).json({
      data: {
        regions,
        locationTypes,
      },
    });
  } catch (error) {
    next(error);
  }
};