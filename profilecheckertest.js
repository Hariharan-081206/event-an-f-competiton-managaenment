// utils/profileValidator.js
function isProfileComplete(profile) {
  const requiredFields = ['fullname', 'dept', 'batch', 'gender', 'domain', 'bio'];
  
  for (const field of requiredFields) {
    if (!profile[field] || profile[field].trim() === '') {
      return false;
    }
  }
  return true;
}

module.exports = isProfileComplete;

// middleware/checkProfile.js
const isProfileComplete = require('../utils/profileValidator');
const User = require('../models/User'); // Your user model

async function checkProfileCompletion(req, res, next) {
  try {
    const userId = req.user.id; // Assuming you use a JWT middleware that sets req.user
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    if (!isProfileComplete(user.profile)) {
      return res.status(400).json({
        success: false,
        message: 'Please complete your profile before registering for a competition.'
      });
    }

    // Profile is complete, allow to proceed
    next();                          
  } catch (error) {
    console.error('Profile check error:', error);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
}

module.exports = checkProfileCompletion;


// routes/competition.js
const express = require('express');
const router = express.Router();
const checkProfileCompletion = require('../middleware/checkProfile');
const Competition = require('../models/Competition'); // Assume you have this model

router.post('/register', checkProfileCompletion, async (req, res) => {
  const userId = req.user.id;
  const competitionId = req.body.competitionId;

  try {
    // Example registration logic
    const competition = await Competition.findById(competitionId);
    if (!competition) {
      return res.status(404).json({ success: false, message: 'Competition not found' });
    }

    // Assume a simple array of participants
    if (competition.participants.includes(userId)) {
      return res.status(400).json({ success: false, message: 'Already registered' });
    }

    competition.participants.push(userId);
    await competition.save();

    res.status(200).json({ success: true, message: 'Successfully registered for competition' });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;



// middleware/auth.js
const jwt = require('jsonwebtoken');

function authenticateToken(req, res, next) {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.sendStatus(401);

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user; // Will be used in checkProfileCompletion
    next();
  });
}

module.exports = authenticateToken;

/*Apply it globally or on your routes like:
router.post('/register', authenticateToken, checkProfileCompletion, ...);*/


