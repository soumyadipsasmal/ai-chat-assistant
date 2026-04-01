const isProduction = process.env.NODE_ENV === 'production';

const parseNumber = (value, fallback) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const parseOrigins = (value) =>
  value
    ? value
        .split(',')
        .map((origin) => origin.trim())
        .filter(Boolean)
    : ['http://localhost:3000', 'http://localhost:3001'];

const requestedAiMode = (
  process.env.AI_MODE || (process.env.ANTHROPIC_API_KEY ? 'anthropic' : 'mock')
).toLowerCase();

const anthropicApiKey = process.env.ANTHROPIC_API_KEY || '';
const aiMode = requestedAiMode === 'anthropic' && anthropicApiKey ? 'anthropic' : 'mock';

const config = {
  aiMode,
  anthropicApiKey,
  anthropicMaxTokens: parseNumber(process.env.ANTHROPIC_MAX_TOKENS, 1024),
  anthropicModel: process.env.ANTHROPIC_MODEL || 'claude-sonnet-4-20250514',
  clientOrigins: parseOrigins(process.env.CLIENT_ORIGIN),
  isProduction,
  jwtSecret:
    process.env.JWT_SECRET || (isProduction ? '' : 'dev-only-secret-change-me'),
  maxChatMessageLength: parseNumber(process.env.MAX_CHAT_MESSAGE_LENGTH, 2000),
  maxConversationMessages: parseNumber(process.env.MAX_CONVERSATION_MESSAGES, 20),
  mongoUri: process.env.MONGO_URI || 'mongodb://mongo:27017/ai-chat',
  port: parseNumber(process.env.PORT, 5000),
};

const validateRuntimeConfig = () => {
  const issues = [];

  if (config.isProduction && !process.env.JWT_SECRET) {
    issues.push('JWT_SECRET must be set in production.');
  }

  if (requestedAiMode === 'anthropic' && !anthropicApiKey) {
    issues.push('AI_MODE=anthropic requires ANTHROPIC_API_KEY.');
  }

  return issues;
};

module.exports = {
  ...config,
  validateRuntimeConfig,
};
