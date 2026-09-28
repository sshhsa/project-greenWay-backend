import createHttpError from 'http-errors';

import { User } from '../../models/user.js';
import { saveFileToCloudinary } from '../../utils/saveFileToCloudinary.js';

// PATCH /api/users/me — private, EXTRA (додаткове завдання).
// Оновлює ім'я та/або аватар поточного користувача (модалка з Header на фронті).
export const updateCurrentUser = async (req, res, next) => {
  try {
    const updates = {};

    if (req.body.name !== undefined) updates.name = req.body.name;

    if (req.file) {
      const { secure_url } = await saveFileToCloudinary(
        req.file.buffer,
        'greenway/avatars',
      );
      updates.avatarUrl = secure_url;
    }

    if (Object.keys(updates).length === 0) {
      throw createHttpError(
        400,
        'Nothing to update: provide name and/or avatar',
      );
    }

    const user = await User.findByIdAndUpdate(req.user._id, updates, {
      new: true,
      runValidators: true,
    });
    if (!user) throw createHttpError(404, 'User not found');

    res.status(200).json({ data: user });
  } catch (error) {
    next(error);
  }
};