import express from 'express';
import { confirmRegistration } from '../controllers/eventconfirmationController.js';

const router = express.Router();

router.post('/confirm-register', confirmRegistration);

export default router;