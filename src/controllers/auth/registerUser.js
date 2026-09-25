import bcrypt from 'bcrypt';
import createHttpError from 'http-errors';

import { User } from '../../models/user.js';
import { createSession, setSessionCookies } from '../../services/auth/session.js';

// POST /api/auth/register — public. Після реєстрації користувач одразу авторизований.
export const registerUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) throw createHttpError(409, 'Email in use');

    const user = await User.create({
      name,
      email,
      password: await bcrypt.hash(password, 10),
    });

    const session = await createSession(user._id);
    setSessionCookies(res, session);

    res.status(201).json({ data: user });
  } catch (error) {
    next(error);
  }
};
