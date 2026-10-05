import createHttpError from 'http-errors';
import { Types } from 'mongoose';
import { Location } from '../../models/location.js';
import { User } from '../../models/user.js';
import {
  buildPaginatedResponse,
  getPaginationParams,
} from '../../utils/pagination.js';

export const getUserLocations = async (_req, res, next) => {
  try {
    const { userId } = _req.params;
    const { page, limit, skip } = getPaginationParams(_req.query);

    const userExists = await User.exists({ _id: userId });
    if (!userExists) {
      throw createHttpError(404, 'User not found');
    }

    const filter = { ownerId: new Types.ObjectId(userId) };

    const [items, totalItems] = await Promise.all([
      Location.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
      Location.countDocuments(filter),
    ]);

    res
      .status(200)
      .json(buildPaginatedResponse({ items, totalItems, page, limit }));
  } catch (error) {
    next(error);
  }
};
