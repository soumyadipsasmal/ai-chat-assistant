const Anthropic = require('@anthropic-ai/sdk');

const {
  aiMode,
  anthropicApiKey,
  anthropicMaxTokens,
  anthropicModel,
  maxConversationMessages,
} = require('../config/env');
const { buildConversationWindow, createMockReply } = require('../utils/chat');

const anthropicClient = anthropicApiKey
  ? new Anthropic({ apiKey: anthropicApiKey })
  : null;

const extractTextReply = (response) => {
  const textBlock = response?.content?.find((block) => block.type === 'text');
  return textBlock?.text?.trim() || 'The assistant returned an empty response.';
};

const generateAssistantReply = async (messages = []) => {
  const conversationWindow = buildConversationWindow(messages, maxConversationMessages);
  const lastUserMessage =
    [...conversationWindow].reverse().find((message) => message.role === 'user')?.content || '';

  if (aiMode === 'mock') {
    return createMockReply(lastUserMessage);
  }

  if (!anthropicClient) {
    throw new Error(
      'Anthropic is not configured. Add ANTHROPIC_API_KEY or set AI_MODE=mock.'
    );
  }

  const response = await anthropicClient.messages.create({
    max_tokens: anthropicMaxTokens,
    messages: conversationWindow,
    model: anthropicModel,
  });

  return extractTextReply(response);
};

module.exports = {
  generateAssistantReply,
};
