import createHttpError from 'http-errors';
import fs from 'node:fs/promises';
import { Location } from '../../models/location.js';
import { User } from '../../models/user.js';
import { saveFileToCloudinary } from '../../utils/saveFileToCloudinary.js';

export const createLocation = async (req, res, next) => {
  const { file, user, body } = req;

  try {
    if (!user?._id) {
      throw createHttpError(401, 'Unauthorized: User context is missing');
    }

    if (!file) {
      throw createHttpError(400, 'Location image is required');
    }

    const isValidType = ['image/jpeg', 'image/png'].includes(file.mimetype);
    const isValidSize = file.size <= 1024 * 1024;

    if (!isValidType || !isValidSize) {
      throw createHttpError(
        400,
        'Invalid file format or size. Only JPG/PNG under 1MB allowed.',
      );
    }

    const { name, description, address, coordinates } = body;
    if (!name?.trim() || !address?.trim()) {
      throw createHttpError(400, 'Fields name and address are required');
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

    const cloudinaryResult = await saveFileToCloudinary(file);
    if (!cloudinaryResult?.secure_url) {
      throw createHttpError(500, 'Failed to upload image to Cloudinary');
    }

    const location = await Location.create({
      name: name.trim(),
      description: description?.trim(),
      address: address.trim(),
      coordinates: parsedCoordinates,
      ownerId: user._id,
      image: cloudinaryResult.secure_url,
    });

    await User.findByIdAndUpdate(user._id, {
      $inc: { articlesAmount: 1 },
    });

    res.status(201).json({
      status: 201,
      message: 'Location created successfully',
      data: location,
    });
  } catch (error) {
    next(error);
  } finally {
    if (file?.path) {
      try {
        await fs.unlink(file.path);
      } catch (unlinkError) {
        console.error(
          `Failed to delete temporary file: ${file.path}`,
          unlinkError,
        );
      }
    }
  }
};
