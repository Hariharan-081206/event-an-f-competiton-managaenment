import express from 'express';
import { createProfile, updateProfileById, getProfileById } from '../controllers/profileControllers.js';

const router = express.Router();

router.post('/create', createProfile);
router.put('/update/:id', updateProfileById);
router.get('/:id', getProfileById);


export default router;
