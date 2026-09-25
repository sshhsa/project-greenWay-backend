import { Location } from '../../models/location.js';

export const findPopularLocations = ({
  filter = {},
  direction = -1,
  skip = 0,
  limit,
}) =>
  Location.collection
    .aggregate([
      { $match: filter },
      {
        $addFields: {
          _feedbackCount: { $size: { $ifNull: ['$feedbacksId', []] } },
        },
      },
      { $sort: { _feedbackCount: direction, _id: 1 } },
      { $skip: skip },
      { $limit: limit },
      { $project: { _feedbackCount: 0 } },
    ])
    .toArray();
