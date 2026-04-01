const cors = require('cors');
const express = require('express');
const mongoose = require('mongoose');

const { aiMode, clientOrigins } = require('./config/env');
const authRoutes = require('./routes/auth.routes');
const chatRoutes = require('./routes/chat.routes');
const metaRoutes = require('./routes/meta.routes');

const app = express();

app.use(
  cors({
    credentials: true,
    origin(origin, callback) {
      if (!origin || clientOrigins.includes(origin)) {
        return callback(null, true);
      }

      const error = new Error('Origin is not allowed by CORS.');
      error.statusCode = 403;
      return callback(error);
    },
  })
);

app.use(express.json({ limit: '1mb' }));

app.get('/health', (req, res) => {
  const databaseState =
    mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';

  res.json({
    aiMode,
    database: databaseState,
    status: 'ok',
  });
});

app.use('/api/meta', metaRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/chat', chatRoutes);

app.use((req, res) => {
  res.status(404).json({ message: 'Route not found.' });
});

app.use((error, req, res, next) => {
  const statusCode = error.statusCode || 500;
  const message =
    statusCode >= 500 ? 'Something went wrong on the server.' : error.message;

  if (statusCode >= 500) {
    console.error(error);
  }

  res.status(statusCode).json({ message });
});

module.exports = app;
