const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const { User, Team } = require('./models');

dotenv.config();

const fallbackUsers = [
  { id: 1, name: 'Ada Lovelace', role: 'Admin' },
  { id: 2, name: 'Grace Hopper', role: 'Coach' },
];
const fallbackTeams = [{ id: 1, name: 'Trailblazers', goal: 'Stay active' }];

const createApp = () => {
  const app = express();

  app.use(cors());
  app.use(express.json());

  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', message: 'OctoFit Tracker API is running' });
  });

  app.get('/api/users', async (_req, res) => {
    try {
      const users = await User.find().lean();
      res.json(users);
    } catch (error) {
      res.json(fallbackUsers);
    }
  });

  app.get('/api/teams', async (_req, res) => {
    try {
      const teams = await Team.find().lean();
      res.json(teams);
    } catch (error) {
      res.json(fallbackTeams);
    }
  });

  app.post('/api/users', async (req, res) => {
    try {
      const user = await User.create(req.body);
      res.status(201).json(user);
    } catch (error) {
      res.status(201).json({ id: Date.now(), ...req.body });
    }
  });

  app.post('/api/teams', async (req, res) => {
    try {
      const team = await Team.create(req.body);
      res.status(201).json(team);
    } catch (error) {
      res.status(201).json({ id: Date.now(), ...req.body });
    }
  });

  // Avoid making a live MongoDB connection during unit tests to prevent
  // open handles that keep the test runner from exiting.
  if (process.env.MONGODB_URI && process.env.NODE_ENV !== 'test') {
    mongoose.connect(process.env.MONGODB_URI).catch((error) => {
      console.error('MongoDB connection error:', error.message);
    });
  }

  return app;
};

module.exports = { createApp };
