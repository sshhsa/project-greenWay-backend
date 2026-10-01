import { Session } from '../../models/session.js';
import { clearSessionCookies } from '../../services/auth/session.js';

export const logoutUser = async (req, res, next) => {
  try {
    await Session.deleteOne({
      _id: req.cookies.sessionId,
      userId: req.user._id,
    });

    clearSessionCookies(res);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
