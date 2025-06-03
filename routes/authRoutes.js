/*import { Router } from 'express';
import { googleAuth, googleAuthCallback, logout } from '../controllers/authControllers.js';

const router = Router();

router.get('/auth/google', googleAuth);
router.get('/auth/google/callback', googleAuthCallback);
router.get('/logout', logout);

export default router;*/

import express from 'express';
import { createHost } from '../controllers/hostControllers.js';
import isHost from '../middleware/isHost.js';
import { googleAuth,googleAuthCallback,logout } from '../controllers/authControllers.js';

const router = express.Router();

router.post('/add-host', createHost);
router.get('/auth/google', googleAuth);
router.get('/auth/google/callback', googleAuthCallback);

router.use(isHost)

export default router;