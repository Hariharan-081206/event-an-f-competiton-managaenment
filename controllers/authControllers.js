import 'dotenv/config';
import passport from 'passport';

export const googleAuth = passport.authenticate('google', { 
  scope: ['profile', 'email'] 
});

export const googleAuthCallback = (req, res, next) => {
  passport.authenticate('google', (err, user, info) => {
    if (err) {
      return res.status(500).json({ 
        success: false,
        error: 'Authentication failed',
        details: err.message 
      });
    }
    if (!user) {
      return res.status(401).json({ 
        success: false,
        error: 'User not authenticated' 
      });
    }

    req.logIn(user, (err) => {
      if (err) {
        return res.status(500).json({ 
          success: false,
          error: 'Session error',
          details: err.message 
        });
      }
      
      // Successful authentication - return user data
      res.json({
        success: true,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role
        },
        session: {
          id: req.sessionID,
          cookie: req.session.cookie
        }
      });
    });
  })(req, res, next);
};

export const logout = (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ 
        success: false,
        error: 'Logout failed',
        details: err.message 
      });
    }
    res.json({ 
      success: true,
      message: 'Logged out successfully' 
    });
  });
};