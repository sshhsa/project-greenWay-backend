import { Session } from '../../models/session.js';
import { clearSessionCookies } from '../../services/auth/session.js';

// POST /api/auth/logout — працює по cookie сесії.
// Cookies чистяться ЗАВЖДИ, навіть якщо сесії вже немає (рішення ментора).
export const logoutUser = async (req, res, next) => {
  try {
    const { sessionId } = req.cookies;
    if (sessionId) await Session.deleteOne({ _id: sessionId });

    clearSessionCookies(res);
    res.status(204).send();
  } catch (error) {
    clearSessionCookies(res);
    next(error);
  }
};
