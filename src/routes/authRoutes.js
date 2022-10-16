import express from 'express';

import { signUpMiddleware, signInMiddleware } from '../middleware/authMiddleware.js';
import { signUpController, signInController } from '../controllers/authControllers.js';

const router = express.Router();

router.post('/signup', signUpMiddleware, signUpController);
router.post('/signin', signInMiddleware, signInController)

export default router;