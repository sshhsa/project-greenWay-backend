import { Router } from 'express';
import { celebrate } from 'celebrate';

import { authenticate } from '../middleware/authenticate.js';
import { registerUser } from '../controllers/auth/registerUser.js';
import { loginUser } from '../controllers/auth/loginUser.js';
import { logoutUser } from '../controllers/auth/logoutUser.js';
import { refreshSession } from '../controllers/auth/refreshSession.js';
import {
  registerUserSchema,
  loginUserSchema,
} from '../validations/auth/authValidation.js';

const router = Router();

router.post('/register', celebrate(registerUserSchema), registerUser);
router.post('/login', celebrate(loginUserSchema), loginUser);
router.post('/logout', authenticate, logoutUser);
router.post('/refresh', refreshSession);

export default router;
