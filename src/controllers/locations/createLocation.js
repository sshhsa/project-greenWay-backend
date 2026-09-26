import createHttpError from 'http-errors';
import { Location } from '../../models/location.js';
import { User } from '../../models/user.js';
import { saveFileToCloudinary } from '../../utils/saveFileToCloudinary.js';

export const createLocation = async (req, res, next) => {
  const { file, user, body } = req;

  try {
    if (!user?._id) {
      throw createHttpError(401, 'Unauthorized: User context is missing');
    }

    const { name, description, coordinates, locationType, region } = body;
    
    if (!name?.trim()) {
      throw createHttpError(400, 'Field name is required');
    }

    if (!locationType?.trim()) {
      throw createHttpError(400, 'Field locationType is required');
    }

    if (!region?.trim()) {
      throw createHttpError(400, 'Field region is required');
    }

    let parsedCoordinates = coordinates;
    if (typeof coordinates === 'string') {
      try {
        parsedCoordinates = JSON.parse(coordinates);
      } catch {
        throw createHttpError(
          400,
          'Invalid coordinates format. Expected JSON.',
        );
      }
    }

    const cloudinaryResult = await saveFileToCloudinary(file.buffer);
    if (!cloudinaryResult?.secure_url) {
      throw createHttpError(500, 'Failed to upload image to Cloudinary');
    }

    const location = await Location.create({
      name: name.trim(),
      description: description?.trim(),
      coordinates: parsedCoordinates,
      locationType: locationType.trim(), 
      region: region.trim(),             
      ownerId: user._id,
      image: cloudinaryResult.secure_url,
    });

    await User.findByIdAndUpdate(user._id, {
      $inc: { articlesAmount: 1 },
    });

    return res.status(201).json({ data: location });
  } catch (error) {
    next(error);
  }
};
