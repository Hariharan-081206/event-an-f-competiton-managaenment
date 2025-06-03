import 'dotenv/config';
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
 })

 