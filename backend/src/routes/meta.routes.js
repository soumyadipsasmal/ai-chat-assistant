const express = require('express');

const { aiMode } = require('../config/env');

const router = express.Router();

router.get('/', (req, res) => {
  res.json({
    aiMode,
    isDemoMode: aiMode === 'mock',
  });
});

module.exports = router;
