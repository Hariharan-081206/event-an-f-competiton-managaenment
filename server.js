// 🌐 Core Imports
import 'dotenv/config';
import express from 'express';
import dotenv from 'dotenv';
import http from 'http';
import mongoose from 'mongoose';
import session from 'express-session';
import cors from 'cors';
import passport from 'passport';
import MongoStore from 'connect-mongo';
import { Server as SocketIOServer } from 'socket.io';
import './jobs/scheduleSheetSync.js';

// 🔧 Configs
import configurePassport from './config/passport.js';

// 📦 Routes
import authRoutes from './routes/authRoutes.js';
import hostRoutes from './routes/hostRoutes.js';
import competitionRoutes from './routes/competitions.js';
import eventRoutes from './routes/eventRoutes.js';
import profileRoute from './routes/profileRoutes.js';
import venueRoutes from './routes/venueRoutes.js';
import confirmRegister from './routes/confirmationRoutes.js';
import templateRoutes from './routes/templateRoutes.js';
import eventregister from './routes/eventconfirmation.js';
import adminRoutes from './routes/adminRoutes.js';

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new SocketIOServer(server, {
  cors: {
    origin: process.env.FRONTEND_URL,
    credentials: true,
  }
});

// ✅ Attach io instance to every request
app.use((req, res, next) => {
  req.io = io;
  next();
});

// ✅ Passport configuration
configurePassport();

// ✅ Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGO_URI,
    ttl: 14 * 24 * 60 * 60,
    autoRemove: 'native'
  }),
  cookie: {
    secure: false,
    httpOnly: false, // Change to true in production
    sameSite: 'lax',
    maxAge: 14 * 24 * 60 * 60 * 1000
  }
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(express.json());

// ✅ Connect both databases
const venueDb = await mongoose.createConnection(process.env.MONGO_URI2).asPromise();
const myProjectDb = await mongoose.createConnection(process.env.MONGO_URI).asPromise();

app.locals.venueDb = venueDb;
app.locals.myProjectDb = myProjectDb;

console.log('✅ Connected to both Project DB and Venue DB');

// ✅ Routes
app.use('/', authRoutes);
app.use('/api/host', hostRoutes);
app.use('/api/competitions', competitionRoutes);
app.use('/api', eventRoutes);
app.use('/api/profile', profileRoute);
app.use('/api/competition', confirmRegister);
app.use('/api/venue', venueRoutes);
app.use('/api/templates', templateRoutes);
app.use('/api/events', eventregister);
app.use('/admin', adminRoutes);

// ✅ Host-only test route
app.get('/api/host-only', (req, res) => {
  if (!req.isAuthenticated() || req.user.role !== 'host') {
    return res.status(403).json({ message: 'Access denied' });
  }
  res.json({ message: 'Welcome, host' });
});

// ✅ Health check
app.get("/", (req, res) => {
  res.send("Server is ready with Google login");
});

// ✅ Socket.io connection logging
io.on('connection', (socket) => {
  console.log('🔌 Client connected to socket.io:', socket.id);

  socket.on('disconnect', () => {
    console.log('🔌 Client disconnected from socket.io:', socket.id);
  });
});

// ✅ Error handler
app.use((err, req, res, next) => {
  console.error('⚠️ Error:', err.stack || err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
  });
});

// ✅ Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
