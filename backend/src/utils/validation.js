const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PASSWORD_MIN_LENGTH = 8;
const USERNAME_MIN_LENGTH = 3;

const normalizeString = (value) => (typeof value === 'string' ? value.trim() : '');

const validateRegistrationInput = (body = {}) => {
  const username = normalizeString(body.username);
  const email = normalizeString(body.email).toLowerCase();
  const password = typeof body.password === 'string' ? body.password : '';
  const errors = [];

  if (username.length < USERNAME_MIN_LENGTH) {
    errors.push(`Username must be at least ${USERNAME_MIN_LENGTH} characters long.`);
  }

  if (!EMAIL_REGEX.test(email)) {
    errors.push('Enter a valid email address.');
  }

  if (password.length < PASSWORD_MIN_LENGTH) {
    errors.push(`Password must be at least ${PASSWORD_MIN_LENGTH} characters long.`);
  }

  return {
    errors,
    value: { username, email, password },
  };
};

const validateLoginInput = (body = {}) => {
  const email = normalizeString(body.email).toLowerCase();
  const password = typeof body.password === 'string' ? body.password : '';
  const errors = [];

  if (!EMAIL_REGEX.test(email)) {
    errors.push('Enter a valid email address.');
  }

  if (!password) {
    errors.push('Password is required.');
  }

  return {
    errors,
    value: { email, password },
  };
};

const validateChatMessage = (body = {}, maxLength = 2000) => {
  const message = normalizeString(body.message);
  const errors = [];

  if (!message) {
    errors.push('Message cannot be empty.');
  }

  if (message.length > maxLength) {
    errors.push(`Message cannot be longer than ${maxLength} characters.`);
  }

  return {
    errors,
    value: { message },
  };
};

module.exports = {
  normalizeString,
  validateChatMessage,
  validateLoginInput,
  validateRegistrationInput,
};
