const mongoose = require('mongoose');
require('dotenv').config();

const app = require('./app');
const { mongoUri, port, validateRuntimeConfig } = require('./config/env');

const startServer = async () => {
  const configIssues = validateRuntimeConfig();

  if (configIssues.length) {
    configIssues.forEach((issue) => console.warn(`[config] ${issue}`));

    if (process.env.NODE_ENV === 'production') {
      process.exit(1);
    }
  }

  try {
    await mongoose.connect(mongoUri);
    console.log('MongoDB connected');

    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  } catch (error) {
    console.error('Failed to start the server.', error);
    process.exit(1);
  }
};

startServer();
