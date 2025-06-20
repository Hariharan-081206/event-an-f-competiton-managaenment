//import { validationResult } from 'express-validator';
import createCompetitionModel from '../models/competitions.js';

export const createCompetition = async (req, res) => {
  try {
    const db = req.app.locals.myProjectDb; // Or venueDb if it's stored there
    const Competition = createCompetitionModel(db);

    const newCompetition = new Competition(req.body);
    await newCompetition.save();

    res.status(201).json(newCompetition);
  } catch (err) {
    console.error('❌ Error creating competition:', err.message);
    res.status(500).send('Server Error');
  }
};

export const getCompetitions = async (req, res) => {
  try {
    const db = req.app.locals.myProjectDb;
    const Competition = createCompetitionModel(db);

    const competitions = await Competition.find().sort({ createdAt: -1 });
    res.json(competitions);
  } catch (err) {
    console.error('❌ Error fetching competitions:', err);
    res.status(500).send('Server Error');
  }
};

export const getCompetitionById = async (req, res) => {
  try {
    const db = req.app.locals.myProjectDb;
    const Competition = createCompetitionModel(db);

    const competition = await Competition.findById(req.params.id);
    if (!competition) return res.status(404).json({ msg: 'Not found' });

    const today = new Date();
    const endDate = new Date(competition.endDate);
    const diff = Math.max(Math.ceil((endDate - today) / (1000 * 60 * 60 * 24)), 0);

    res.json({
      ...competition.toObject(),
      daysLeft: `${diff} days`
    });
  } catch (err) {
    console.error('❌ Error fetching competition by ID:', err);
    res.status(500).send('Server Error');
  }
};

export const updateCompetition = async (req, res) => {
  try {
    const db = req.app.locals.myProjectDb;
    const Competition = createCompetitionModel(db);

    const updated = await Competition.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ msg: 'Not found' });

    res.json(updated);
  } catch (err) {
    console.error('❌ Error updating competition:', err);
    res.status(500).send('Server Error');
  }
};

export const deleteCompetition = async (req, res) => {
  try {
    const db = req.app.locals.myProjectDb;
    const Competition = createCompetitionModel(db);

    const deleted = await Competition.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ msg: 'Not found' });

    res.json({ msg: 'Competition removed' });
  } catch (err) {
    console.error('❌ Error deleting competition:', err);
    res.status(500).send('Server Error');
  }
};
