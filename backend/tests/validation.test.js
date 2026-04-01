const assert = require('node:assert/strict');

const {
  validateChatMessage,
  validateLoginInput,
  validateRegistrationInput,
} = require('../src/utils/validation');

module.exports = (runTest) => {
  runTest('validateRegistrationInput rejects weak user details', () => {
    const result = validateRegistrationInput({
      email: 'not-an-email',
      password: '123',
      username: 'ab',
    });

    assert.equal(result.errors.length, 3);
  });

  runTest('validateLoginInput normalizes email and accepts valid data', () => {
    const result = validateLoginInput({
      email: ' TEST@EXAMPLE.COM ',
      password: 'super-secret',
    });

    assert.deepEqual(result.errors, []);
    assert.equal(result.value.email, 'test@example.com');
  });

  runTest('validateChatMessage rejects empty and oversized input', () => {
    const empty = validateChatMessage({ message: '   ' }, 10);
    const long = validateChatMessage({ message: '01234567890' }, 10);

    assert.equal(empty.errors[0], 'Message cannot be empty.');
    assert.equal(long.errors[0], 'Message cannot be longer than 10 characters.');
  });
};
