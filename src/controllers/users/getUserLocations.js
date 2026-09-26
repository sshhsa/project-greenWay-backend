import { Types } from "mongoose";
import { Location } from "../../models/location.js";
import { buildPaginatedResponse, getPaginationParams } from "../../utils/pagination.js";

// Приклад формату відповіді: res.status(200).json({ data: ... }) або buildPaginatedResponse(...)
export const getUserLocations = async (req, res) => {
  const { userId } = req.params;
  const { page, limit, skip } = getPaginationParams(req.query);

  const filter = { ownerId: new Types.ObjectId(userId) };

  const [items, totalItems] = await Promise.all([
    Location.find(filter).skip(skip).limit(limit),
    Location.countDocuments(filter),
  ]);

  res
    .status(200)
    .json(buildPaginatedResponse({ items, totalItems, page, limit }));
};
