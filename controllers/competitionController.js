import Competition from '../models/competitions.js';
//import { validationResult } from 'express-validator';

/*export const createCompetition = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const {
    title,
    Organizer,
    mode,
    Rules,
    location,
    prize,
    daysLeft,
    link,
  } = req.body;

  try {
    const newCompetition = new Competition({
      title,
      Organizer,
      mode,
      Rules,
      location,
      prize,
      daysLeft,
      linkink,
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

    const competitionsWithDaysLeft = competitions.map(comp => {
      const today = new Date();
      const endDate = new Date(comp.endDate);  // Make sure your schema has `endDate`
      const diffTime = endDate - today;
      const daysLeft = Math.max(Math.ceil(diffTime / (1000 * 60 * 60 * 24)), 0);

      return {
        ...comp.toObject(),
        daysLeft: `${daysLeft} days`
      };
    });

    res.json(competitionsWithDaysLeft);
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

    const today = new Date();
    const endDate = new Date(competition.endDate); // assumes endDate exists
    const diffTime = endDate - today;
    const daysLeft = Math.max(Math.ceil(diffTime / (1000 * 60 * 60 * 24)), 0);

    res.json({
      ...competition.toObject(),
      daysLeft: `${daysLeft} days`
    });

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

    // Calculate updated daysLeft if endDate exists
    let daysLeft = null;
    if (competition.endDate) {
      const today = new Date();
      const endDate = new Date(competition.endDate);
      const diffTime = endDate - today;
      daysLeft = Math.max(Math.ceil(diffTime / (1000 * 60 * 60 * 24)), 0);
    }

    res.json({
      ...competition.toObject(),
      daysLeft: daysLeft !== null ? `${daysLeft} days` : undefined
    });

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
};*/




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
