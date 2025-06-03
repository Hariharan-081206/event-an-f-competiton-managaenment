import Competition from '../models/competitions.js';
import { validationResult } from 'express-validator';

export const createCompetition = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const {
    Competitionname,
    Organizationname,
    Description,
    Rules,
    Status,
    RegistrationLink,
    ConfirmationLink,
  } = req.body;

  try {
    const newCompetition = new Competition({
      Competitionname,
      Organizationname,
      Description,
      Rules,
      Status,
      RegistrationLink,
      ConfirmationLink,
    });

    const competition = await newCompetition.save();
    res.json(competition);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

export const getCompetitions = async (req, res) => {
  try {
    const competitions = await Competition.find().sort({ createdAt: -1 });
    res.json(competitions);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

export const getCompetitionById = async (req, res) => {
  try {
    const competition = await Competition.findById(req.params.id);
    
    if (!competition) {
      return res.status(404).json({ msg: 'Competition not found' });
    }
    
    res.json(competition);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Competition not found' });
    }
    res.status(500).send('Server Error');
  }
};

export const updateCompetition = async (req, res) => {
  try {
    const competition = await Competition.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!competition) {
      return res.status(404).json({ msg: 'Competition not found' });
    }

    res.json(competition);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};


  
export const deleteCompetition = async (req, res) => {
  try {
    const competition = await Competition.findByIdAndDelete(req.params.id);

    if (!competition) {
      return res.status(404).json({ msg: 'Competition not found' });
    }

    res.json({ msg: 'Competition removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};
