const express = require('express');
const Anthropic = require('@anthropic-ai/sdk');
const jwt = require('jsonwebtoken');
const Chat = require('../models/Chat');
const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// Auth middleware
const auth = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token' });
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ message: 'Invalid token' });
  }
};

// Get all chats for user
router.get('/', auth, async (req, res) => {
  try {
    const chats = await Chat.find({ userId: req.user.userId })
      .select('title createdAt updatedAt')
      .sort({ updatedAt: -1 });
    res.json(chats);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get single chat
router.get('/:id', auth, async (req, res) => {
  try {
    const chat = await Chat.findOne({ _id: req.params.id, userId: req.user.userId });
    if (!chat) return res.status(404).json({ message: 'Chat not found' });
    res.json(chat);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create new chat
router.post('/new', auth, async (req, res) => {
  try {
    const chat = new Chat({ userId: req.user.userId, messages: [] });
    await chat.save();
    res.status(201).json(chat);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Send message
router.post('/:id/message', auth, async (req, res) => {
  try {
    const { message } = req.body;
    const chat = await Chat.findOne({ _id: req.params.id, userId: req.user.userId });
    if (!chat) return res.status(404).json({ message: 'Chat not found' });

    // Add user message
    chat.messages.push({ role: 'user', content: message });

    // Update title on first message
    if (chat.messages.length === 1) {
      chat.title = message.slice(0, 50) + (message.length > 50 ? '...' : '');
    }

    // Call Anthropic API
    const response = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      messages: chat.messages.map(m => ({ role: m.role, content: m.content }))
    });

    const aiReply = response.content[0].text;
    chat.messages.push({ role: 'assistant', content: aiReply });
    await chat.save();

    res.json({ reply: aiReply, chat });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete chat
router.delete('/:id', auth, async (req, res) => {
  try {
    await Chat.findOneAndDelete({ _id: req.params.id, userId: req.user.userId });
    res.json({ message: 'Chat deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
