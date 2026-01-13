const express = require('express');
const router = express.Router();
const Subspace = require('../models/Subspace');
const Space = require('../models/Space');
const User = require('../models/User');

// 1. CREATE SUBSPACE (Only Admin/Members of parent space can do this)
router.post('/create', async (req, res) => {
  try {
    const { name, parentSpaceId, memberIds } = req.body; // memberIds = list of users allowed
    
    const newSubspace = new Subspace({
      name,
      parentSpace: parentSpaceId,
      members: memberIds || [], 
      tasks: []
    });

    const savedSubspace = await newSubspace.save();
    res.status(201).json(savedSubspace);
  } catch (err) {
    res.status(500).json(err);
  }
});

// 2. GET SUBSPACES (Only if user is allowed in them)
router.get('/space/:parentSpaceId/:userId', async (req, res) => {
  try {
    const subspaces = await Subspace.find({
      parentSpace: req.params.parentSpaceId,
      members: req.params.userId // Only find subspaces where I am a member
    });
    res.status(200).json(subspaces);
  } catch (err) {
    res.status(500).json(err);
  }
});

// 3. GET SINGLE SUBSPACE
router.get('/:id', async (req, res) => {
  try {
    const subspace = await Subspace.findById(req.params.id);
    res.status(200).json(subspace);
  } catch (err) {
    res.status(500).json(err);
  }
});

// 4. ADD TASK TO SUBSPACE
router.post('/:id/tasks', async (req, res) => {
  try {
    const subspace = await Subspace.findById(req.params.id);
    subspace.tasks.push({ description: req.body.description });
    await subspace.save();
    res.status(200).json(subspace);
  } catch (err) {
    res.status(500).json(err);
  }
});

// 5. TOGGLE TASK
router.patch('/:id/tasks/:taskId', async (req, res) => {
  try {
    const subspace = await Subspace.findById(req.params.id);
    const task = subspace.tasks.id(req.params.taskId);
    task.status = task.status === 'Pending' ? 'Done' : 'Pending';
    await subspace.save();
    res.status(200).json(subspace);
  } catch (err) {
    res.status(500).json(err);
  }
});
// ADD MEMBER TO SUBSPACE (Invite after creation)
router.post('/:id/invite', async (req, res) => {
  try {
    const { username } = req.body;
    const User = require('../models/User'); 
    
    // 1. Find the user
    const user = await User.findOne({ username });
    if (!user) return res.status(404).json("User not found!");

    // 2. Add to subspace
    const subspace = await Subspace.findById(req.params.id);
    if (!subspace.members.includes(user._id)) {
      subspace.members.push(user._id);
      await subspace.save();
    }
    
    res.status(200).json(subspace);
  } catch (err) {
    res.status(500).json(err);
  }
});
module.exports = router;