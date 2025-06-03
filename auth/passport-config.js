import { Strategy as LocalStrategy } from 'passport-local';
import users from '../users/userModel.js';

const initialize = (passport) => {
  const authenticateUser = (username, password, done) => {
    const user = users.find(user => user.username === username);
    if (!user) return done(null, false, { message: 'No user found' });

    if (user.password === password) {
      return done(null, user);
    } else {
      return done(null, false, { message: 'Wrong password' });
    }
  };

  passport.use(new LocalStrategy(authenticateUser));
  passport.serializeUser((user, done) => done(null, user.id));
  passport.deserializeUser((id, done) => {
    const user = users.find(user => user.id === id);
    done(null, user);
  });
};

export default initialize;