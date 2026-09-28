// Прошарок авторизації (ТЗ п.9). Для всіх private-ендпоінтів.
// Після нього в контролерах доступний req.user (документ User без пароля).
import createHttpError from 'http-errors';

import { Session } from '../models/session.js';
import { User } from '../models/user.js';

export const authenticate = async (req, _res, next) => {
  try {
    const { sessionId, accessToken } = req.cookies;
    if (!sessionId || !accessToken)
      throw createHttpError(401, 'Missing session credentials');

    const session = await Session.findOne({ _id: sessionId, accessToken });
    if (!session) throw createHttpError(401, 'Session not found');

    if (session.accessTokenValidUntil < new Date()) {
      throw createHttpError(401, 'Access token expired');
    }

    const user = await User.findById(session.userId);
    if (!user) throw createHttpError(401, 'User not found');

    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};
