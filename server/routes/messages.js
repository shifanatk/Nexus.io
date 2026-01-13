const express = require('express');
const router = express.Router();
const Message = require('../models/Message');

// 1. SEND A MESSAGE
router.post('/send', async (req, res) => {
  try {
    const { senderId, username, content, spaceId, subspaceId, type } = req.body;
    
    const newMessage = new Message({
      sender: senderId,
      username,
      content,
      spaceId: spaceId || null,
      subspaceId: subspaceId || null,
      type: type || 'chat'
    });

    const savedMessage = await newMessage.save();
    res.status(200).json(savedMessage);
  } catch (err) {
    res.status(500).json(err);
  }
});

// 2. GET MESSAGES (For a Workspace)
router.get('/space/:spaceId', async (req, res) => {
  try {
    const messages = await Message.find({ spaceId: req.params.spaceId }).sort({ createdAt: 1 });
    res.status(200).json(messages);
  } catch (err) {
    res.status(500).json(err);
  }
});

// 3. GET MESSAGES (For a Subspace)
router.get('/subspace/:subspaceId', async (req, res) => {
  try {
    const messages = await Message.find({ subspaceId: req.params.subspaceId }).sort({ createdAt: 1 });
    res.status(200).json(messages);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;