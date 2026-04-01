const assert = require('node:assert/strict');

const {
  buildConversationWindow,
  createMockReply,
  deriveChatTitle,
} = require('../src/utils/chat');

module.exports = (runTest) => {
  runTest('deriveChatTitle trims and shortens long messages', () => {
    const title = deriveChatTitle(
      '   This is a very long message that should be shortened for the chat title   '
    );
    assert.equal(title, 'This is a very long message that should be shorten...');
  });

  runTest('buildConversationWindow keeps only the most recent messages', () => {
    const messages = [
      { role: 'user', content: 'one' },
      { role: 'assistant', content: 'two' },
      { role: 'user', content: 'three' },
    ];

    assert.deepEqual(buildConversationWindow(messages, 2), [
      { role: 'assistant', content: 'two' },
      { role: 'user', content: 'three' },
    ]);
  });

  runTest('createMockReply includes the user prompt for demo mode', () => {
    const reply = createMockReply('How do I deploy this project?');
    assert.match(reply, /Demo mode is enabled/);
    assert.match(reply, /How do I deploy this project\?/);
  });
};
