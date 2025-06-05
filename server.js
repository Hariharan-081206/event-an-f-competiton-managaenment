/*import 'dotenv/config';
import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import session from 'express-session';
import cors from 'cors';
import passport from 'passport';
import configurePassport from './config/passport.js';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import studentRoutes from './routes/studentRoutes.js';
import competitions from './routes/competitions.js';

const app = express();

// Passport configuration

configurePassport();
dotenv.config();

// Middleware

app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(session({
  secret: process.env.SESSION_SECRET || 'fallback-secret-key',
  resave: false,
  saveUninitialized: false,
}));
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.get('/', (req, res) => res.send('Server is ready'));
// Authentication routes (from first example)
app.get('/login', (req, res) => {
  res.send(`
    <form action="/login" method="POST">
      <input name="username" placeholder="Username"/><br/>
      <input name="password" type="password" placeholder="Password"/><br/>
      <button type="submit">Login</button>
    </form>
  `);
});

app.post('/login', passport.authenticate('local', {
  successRedirect: '/dashboard',
  failureRedirect: '/login',
}));
app.get('/dashboard', (req, res) => {
  if (req.isAuthenticated()) {
    res.send('Welcome to your dashboard!');
  } else {
    res.redirect('/login');
  }
});
// Modular routes (from second example)
app.use('/', authRoutes);
app.use('/', userRoutes);
app.use('/api/students',studentRoutes);
app.use('/api/competitions', competitions);

app.use(express.json());



app.get("/",(req,res)=>{
    res.send("Server is ready");
})

const PORT = process.env.PORT || 5000; 
 console.log(process.env.MONGO_URI);
 app.listen(PORT,() =>{
    connectDB();
    console.log(`Server is running in ${PORT}`);
 })*/

import 'dotenv/config';
import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import session from 'express-session';
import cors from 'cors';
import passport from 'passport';
import configurePassport from './config/passport.js';
import authRoutes from './routes/authRoutes.js';
//import scraperRoutes from './routes/scrapingRoutes.js';
//import { startScrapingScheduler } from './services/scrapingScheduler.js';
import hostRoutes from './routes/hostRoutes.js';
import MongoStore from 'connect-mongo';
import competitionRoutes from './routes/competitions.js';
import eventRoutes from './routes/eventRoutes.js';

const app = express();
dotenv.config();

// Passport configuration
configurePassport();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));

// Required for maintaining session across Google login
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({            // Add this block
    mongoUrl: process.env.MONGO_URI,
    ttl: 14 * 24 * 60 * 60,            // Session TTL (14 days)
    autoRemove: 'native'               // Cleanup expired sessions
  }),
  cookie: { 
    secure: false,                     // Set to true in production (HTTPS)
    httpOnly: false,                   //change it after testing
    sameSite: 'lax',
    maxAge: 14 * 24 * 60 * 60 * 1000  // Matches TTL
  }
}));

app.use(passport.initialize());
app.use(passport.session());

// JSON parser
app.use(express.json());

// Routes
app.use('/', authRoutes);
//app.use('/api', scraperRoutes);
app.use('/api/host',hostRoutes);
app.use('/api/competitions', competitionRoutes);
app.use('/api',eventRoutes);

/*app.get('/api/me', (req, res) => {
  if (req.isAuthenticated()) {
    res.json({ user: req.user });
  } else {
    res.status(401).json({ message: 'Not logged in' });
  }
});*/
app.get('/api/host-only', (req, res) => {
  if (!req.isAuthenticated() || req.user.role !== 'host') {
    return res.status(403).json({ message: 'Access denied' });
  }
  res.json({ message: 'Welcome, host' });
});
// Health check
app.get("/", (req, res) => {
  res.send("Server is ready with Google login");
});

// Connect to DB and start server
const PORT = process.env.PORT || 5000;
connectDB().then(() => {
  // Start the scraping scheduler after DB connection is established
  //startScrapingScheduler();
  
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});

 