const express = require('express');
const router = express.Router();
const Space = require('../models/Space');
const User = require('../models/User'); // Required for invites

// 1. CREATE A NEW SPACE
router.post('/create', async (req, res) => {
  try {
    const { name, ownerId } = req.body;
    const newSpace = new Space({
      name,
      owner: ownerId, 
      members: [], // Start with no members
      tasks: []
    });
    const savedSpace = await newSpace.save();
    res.status(201).json(savedSpace);
  } catch (err) {
    res.status(500).json(err);
  }
});

// 2. GET SPACES FOR A USER (Owned OR Invited)
// GET SPACES FOR A USER
router.get('/user/:userId', async (req, res) => {
  try {
    // ⚠️ CRITICAL CHECK: Does your code look EXACTLY like this?
    const spaces = await Space.find({
      $or: [
        { owner: req.params.userId },   // Condition 1: I own it
        { members: req.params.userId }  // Condition 2: I am a member
      ]
    });
    res.status(200).json(spaces);
  } catch (err) {
    res.status(500).json(err);
  }
});

// 3. GET SINGLE SPACE BY ID (This was likely missing!)
router.get('/:id', async (req, res) => {
  try {
    const space = await Space.findById(req.params.id);
    res.status(200).json(space);
  } catch (err) {
    res.status(500).json(err);
  }
});

// 4. ADD MEMBER (INVITE)
router.post('/:id/invite', async (req, res) => {
  try {
    const { username } = req.body;
    
    // Find the user to invite
    const user = await User.findOne({ username });
    if (!user) return res.status(404).json("User not found!");

    const space = await Space.findById(req.params.id);
    
    // Add if not already a member
    if (!space.members.includes(user._id)) {
      space.members.push(user._id);
      await space.save();
    }
    
    res.status(200).json(space);
  } catch (err) {
    res.status(500).json(err);
  }
});

// 5. ADD TASK
router.post('/:id/tasks', async (req, res) => {
  try {
    const space = await Space.findById(req.params.id);
    space.tasks.push({
      description: req.body.description,
      status: 'Pending'
    });
    const updatedSpace = await space.save();
    res.status(200).json(updatedSpace);
  } catch (err) {
    res.status(500).json(err);
  }
});

// 6. TOGGLE TASK STATUS
router.patch('/:id/tasks/:taskId', async (req, res) => {
  try {
    const space = await Space.findById(req.params.id);
    const task = space.tasks.id(req.params.taskId);
    task.status = task.status === 'Pending' ? 'Done' : 'Pending';
    await space.save();
    res.status(200).json(space);
  } catch (err) {
    res.status(500).json(err);
  }
});

// 7. DELETE TASK
router.delete('/:id/tasks/:taskId', async (req, res) => {
  try {
    const space = await Space.findById(req.params.id);
    space.tasks = space.tasks.filter(task => task._id.toString() !== req.params.taskId);
    await space.save();
    res.status(200).json(space);
  } catch (err) {
    res.status(500).json(err);
  }
});
// ADD COMMENT TO TASK
router.post('/:id/tasks/:taskId/comment', async (req, res) => {
  try {
    const space = await Space.findById(req.params.id);
    const task = space.tasks.id(req.params.taskId);
    
    task.comments.push({
      sender: req.body.userId,
      username: req.body.username,
      text: req.body.text
    });

    await space.save();
    res.status(200).json(space);
  } catch (err) {
    res.status(500).json(err);
  }
});
module.exports = router;