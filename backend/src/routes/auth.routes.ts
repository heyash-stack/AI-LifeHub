import { Router } from 'express';
import { registerHandler, loginHandler, refreshHandler } from '../controllers/auth.controller';
import { validateRequest } from '../middlewares/validate.middleware';
import { registerSchema, loginSchema, refreshTokenSchema } from '../models/auth.dto';

const router = Router();

router.post('/register', validateRequest(registerSchema), registerHandler);
router.post('/login', validateRequest(loginSchema), loginHandler);
router.post('/refresh', validateRequest(refreshTokenSchema), refreshHandler);

export default router;
