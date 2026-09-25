import createHttpError from 'http-errors';

import { Session } from '../../models/session.js';
import {
  clearSessionCookies,
  createSession,
  setSessionCookies,
} from '../../services/auth/session.js';

// POST /api/auth/refresh — доступ по refreshToken (без authenticate).
export const refreshSession = async (req, res, next) => {
  try {
    const { sessionId, refreshToken } = req.cookies;
    if (!sessionId || !refreshToken) throw createHttpError(401, 'Missing session credentials');

    const session = await Session.findOne({ _id: sessionId, refreshToken });
    if (!session) throw createHttpError(401, 'Session not found');

    await session.deleteOne();

    if (session.refreshTokenValidUntil < new Date()) {
      clearSessionCookies(res);
      throw createHttpError(401, 'Session expired');
    }

    const newSession = await createSession(session.userId);
    setSessionCookies(res, newSession);

    res.status(200).json({ data: { message: 'Session refreshed' } });
  } catch (error) {
    next(error);
  }
};
