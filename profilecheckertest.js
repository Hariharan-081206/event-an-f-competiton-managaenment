// passport-config.js
/*const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const User = require('./models/User'); // Adjust if needed

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET,
};

module.exports = (passport) => {
  passport.use(
    new JwtStrategy(opts, async (jwt_payload, done) => {
      try {
        const user = await User.findById(jwt_payload.id);
        if (user) {
          return done(null, user); // Will attach to req.user
        } else {
          return done(null, false);
        }
      } catch (err) {
        return done(err, false);
      }
    })
  );
};



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
const User = require('../models/User');

async function checkProfileCompletion(req, res, next) {
  try {
    const userId = req.user.id; // req.user is set by passport
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

    next(); // All good, move to route logic
  } catch (error) {
    console.error('Profile check error:', error);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
}

module.exports = checkProfileCompletion;

// routes/competition.js
const express = require('express');
const passport = require('passport');
const checkProfileCompletion = require('../middleware/checkProfile');

const router = express.Router();

router.post(
  '/register',
  passport.authenticate('jwt', { session: false }),
  checkProfileCompletion,
  async (req, res) => {
    // Your registration logic here
    res.status(200).json({ success: true, message: 'Registered successfully!' });
  }
);

module.exports = router;


//server.js 
// app.js
const express = require('express');
const passport = require('passport');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config();
require('./passport-config')(passport); // Initialize passport strategy

const app = express();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB error:', err));

// Middleware
app.use(express.json());
app.use(passport.initialize());

// Routes
const competitionRoutes = require('./routes/competition');
app.use('/api/competition', competitionRoutes);

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

/*Apply it globally or on your routes like:
router.post('/register', authenticateToken, checkProfileCompletion, ...);*/


