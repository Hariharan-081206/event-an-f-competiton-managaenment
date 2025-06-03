import { Router } from 'express';
import { check } from 'express-validator';
import isHost from '../middleware/isHost.js';
import {
  createCompetition,
  getCompetitions,
  getCompetitionById,
  updateCompetition,
  deleteCompetition
} from '../controllers/competitionController.js';

const router = Router();

router.post(
  '/',
  isHost,
    [
      check('title', 'Competition name is required').not().isEmpty(),
      check('Organizer', 'Organization name is required').not().isEmpty(),
      check('mode', 'mode is required').not().isEmpty(),
      check('Rules', 'Rules to be mentioned are required').not().isEmpty(),
      check('location', 'location is required').not().isEmpty(),
      check('daysLeft', 'daysLeft is required').not().isEmpty(),
      check('link', 'Registration URL is required').not().isEmpty(),
      
    
  ],
  createCompetition
);

router.get('/', getCompetitions);

router.get('/:id', getCompetitionById);


router.put('/:id', isHost, updateCompetition);


router.delete('/:id', isHost, deleteCompetition);

export default router;