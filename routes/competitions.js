import { Router } from 'express';
import { check } from 'express-validator';
//import auth from '../middleware/auth.js';
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
  [
    //auth,
    [
      check('Competitionname', 'Competition name is required').not().isEmpty(),
      check('Organizationname', 'Organization name is required').not().isEmpty(),
      check('Description', 'Description is required').not().isEmpty(),
      check('Rules', 'Rules to be mentioned are required').not().isEmpty(),
      check('Status', 'Status is required').not().isEmpty(),
      check('RegistrationLink', 'Registration URL is required').not().isEmpty(),
      check('ConfirmationLink', 'Confirmation URL is required').not().isEmpty(),
    ]
  ],
  createCompetition
);

router.get('/', getCompetitions);

router.get('/:id', getCompetitionById);


router.put('/:id', updateCompetition);


router.delete('/:id', deleteCompetition);

export default router;