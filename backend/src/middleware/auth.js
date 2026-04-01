const jwt = require('jsonwebtoken');

const { jwtSecret } = require('../config/env');

const auth = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Authentication token is required.' });
  }

  try {
    req.user = jwt.verify(token, jwtSecret);
    return next();
  } catch (error) {
    return res.status(401).json({ message: 'Authentication token is invalid.' });
  }
};

module.exports = auth;
