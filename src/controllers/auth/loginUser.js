import bcrypt from 'bcrypt';
import createHttpError from 'http-errors';

import { User } from '../../models/user.js';
import { Session } from '../../models/session.js';
import {
  createSession,
  setSessionCookies,
} from '../../services/auth/session.js';

// POST /api/auth/login — public.
export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    // user.password відсутній у seed-юзерів → їм логін неможливий (так і має бути)
    const isValid =
      user?.password && (await bcrypt.compare(password, user.password));
    if (!isValid) throw createHttpError(401, 'Invalid email or password');

    await Session.deleteMany({ userId: user._id });
    const session = await createSession(user._id);
    setSessionCookies(res, session);

    res.status(200).json({ data: user });
  } catch (error) {
    next(error);
  }
};
