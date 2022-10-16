import  express  from 'express';

import {authToken} from '../middleware/authMiddleware.js'
import {rankingController, usersProperty} from '../controllers/usersControllers.js'

const router = express.Router()

router.get('/users/me', authToken, usersProperty);
router.get('/ranking', rankingController)

export default router;