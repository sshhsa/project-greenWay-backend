import { Region } from '../../models/region.js';
import { LocationType } from '../../models/locationType.js';

export const getCategories = async (_req, res, next) => {
  try {
    const [regions, locationTypes] = await Promise.all([
      // за алфавітом з урахуванням української абетки (і, ї, є, ґ)
      Region.find().collation({ locale: 'uk' }).sort({ region: 1 }).lean(),
      LocationType.find().collation({ locale: 'uk' }).sort({ type: 1 }).lean(),
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