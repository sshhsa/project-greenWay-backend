import createHttpError from 'http-errors';
import { Location } from '../../models/location.js';
import { saveFileToCloudinary } from '../../utils/saveFileToCloudinary.js';

export const updateLocation = async (req, res, next) => {
  const { file, user, body } = req;
  const { locationId } = req.params;

  try {
    if (!user?._id) {
      throw createHttpError(401, 'Unauthorized: User context is missing');
    }

    const location = await Location.findById(locationId);

    if (!location) {
      throw createHttpError(404, 'Location not found');
    }

    if (!location.ownerId.equals(user._id)) {
      throw createHttpError(
        403,
        'Forbidden: You can update only your own location',
      );
    }

    const updateData = {};

    if (body.name !== undefined) {
      updateData.name = body.name.trim();
    }

    if (body.locationType !== undefined) {
      updateData.locationType = body.locationType.trim();
    }

    if (body.region !== undefined) {
      updateData.region = body.region.trim();
    }

    if (body.description !== undefined) {
      updateData.description = body.description.trim();
    }

    if (body.coordinates !== undefined) {
      let parsedCoordinates = body.coordinates;

      if (typeof body.coordinates === 'string') {
        try {
          parsedCoordinates = JSON.parse(body.coordinates);
        } catch {
          throw createHttpError(
            400,
            'Invalid coordinates format. Expected JSON.',
          );
        }
      }

      updateData.coordinates = parsedCoordinates;
    }

    if (file) {
      const cloudinaryResult = await saveFileToCloudinary(file.buffer);

      if (!cloudinaryResult?.secure_url) {
        throw createHttpError(500, 'Failed to upload image to Cloudinary');
      }

      updateData.image = cloudinaryResult.secure_url;
    }

    if (Object.keys(updateData).length === 0) {
      throw createHttpError(
        400,
        'At least one field or image must be provided',
      );
    }

    Object.assign(location, updateData);

    await location.save();

    return res.status(200).json({ data: location });
  } catch (error) {
    next(error);
  }
};