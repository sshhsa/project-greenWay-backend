import createHttpError from 'http-errors';
import { User } from '../../models/user.js';

export const getUserById = async (req, res, next) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId).select(
      'name avatarUrl articlesAmount',
    );

    if (!user) {
      throw createHttpError(404, 'User not found');
    }

    res.status(200).json({ data: user });
  } catch (error) {
    next(error);
  }
};
