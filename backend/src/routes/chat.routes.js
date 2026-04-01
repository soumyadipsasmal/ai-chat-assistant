const express = require('express');
const mongoose = require('mongoose');

const { maxChatMessageLength } = require('../config/env');
const auth = require('../middleware/auth');
const Chat = require('../models/Chat');
const { generateAssistantReply } = require('../services/ai.service');
const { deriveChatTitle } = require('../utils/chat');
const { validateChatMessage } = require('../utils/validation');

const router = express.Router();

router.use(auth);

const validateChatId = (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ message: 'Chat id is invalid.' });
  }

  return next();
};

router.get('/', async (req, res) => {
  try {
    const chats = await Chat.find({ userId: req.user.userId })
      .select('title createdAt updatedAt')
      .sort({ updatedAt: -1 });

    return res.json(chats);
  } catch (error) {
    return res.status(500).json({ message: 'Unable to load chats right now.' });
  }
});

router.get('/:id', validateChatId, async (req, res) => {
  try {
    const chat = await Chat.findOne({ _id: req.params.id, userId: req.user.userId });

    if (!chat) {
      return res.status(404).json({ message: 'Chat not found.' });
    }

    return res.json(chat);
  } catch (error) {
    return res.status(500).json({ message: 'Unable to load this chat right now.' });
  }
});

router.post('/new', async (req, res) => {
  try {
    const chat = new Chat({ userId: req.user.userId, messages: [] });
    await chat.save();
    return res.status(201).json(chat);
  } catch (error) {
    return res.status(500).json({ message: 'Unable to create a new chat right now.' });
  }
});

router.post('/:id/message', validateChatId, async (req, res) => {
  try {
    const { errors, value } = validateChatMessage(req.body, maxChatMessageLength);

    if (errors.length) {
      return res.status(400).json({ errors, message: errors[0] });
    }

    const chat = await Chat.findOne({ _id: req.params.id, userId: req.user.userId });

    if (!chat) {
      return res.status(404).json({ message: 'Chat not found.' });
    }

    chat.messages.push({ content: value.message, role: 'user' });

    if (chat.messages.length === 1) {
      chat.title = deriveChatTitle(value.message);
    }

    await chat.save();

    const aiReply = await generateAssistantReply(chat.messages);
    chat.messages.push({ role: 'assistant', content: aiReply });
    await chat.save();

    return res.json({ chat, reply: aiReply });
  } catch (error) {
    return res.status(500).json({
      message:
        error.message || 'Unable to generate a reply right now. Please try again.',
    });
  }
});

router.delete('/:id', validateChatId, async (req, res) => {
  try {
    const deletedChat = await Chat.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.userId,
    });

    if (!deletedChat) {
      return res.status(404).json({ message: 'Chat not found.' });
    }

    return res.json({ message: 'Chat deleted.' });
  } catch (error) {
    return res.status(500).json({ message: 'Unable to delete this chat right now.' });
  }
});

module.exports = router;
