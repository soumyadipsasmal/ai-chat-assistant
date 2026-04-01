const collapseWhitespace = (value) => value.replace(/\s+/g, ' ').trim();

const deriveChatTitle = (message, maxLength = 50) => {
  const normalized = collapseWhitespace(message || '');

  if (!normalized) {
    return 'New Chat';
  }

  return normalized.length > maxLength
    ? `${normalized.slice(0, maxLength)}...`
    : normalized;
};

const buildConversationWindow = (messages = [], maxMessages = 20) =>
  messages.slice(-maxMessages).map(({ role, content }) => ({ role, content }));

const createMockReply = (lastUserMessage) => {
  const prompt = collapseWhitespace(lastUserMessage || 'No message was provided.');

  return [
    'Demo mode is enabled, so this reply was generated locally.',
    '',
    `You asked: "${prompt}"`,
    '',
    'To connect a real model later, add ANTHROPIC_API_KEY and set AI_MODE=anthropic.',
  ].join('\n');
};

module.exports = {
  buildConversationWindow,
  createMockReply,
  deriveChatTitle,
};
