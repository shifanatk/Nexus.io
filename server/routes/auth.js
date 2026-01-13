const express = require('express');
const router = express.Router();
const User = require('../models/User');

// REGISTER
router.post('/register', async (req, res) => {
  try {
    const { username, password, role } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
        console.log("⚠️ Error: Username already taken");
        return res.status(400).json({ message: "Username already taken" });
    }

    const newUser = new User({ username, password, role });
    await newUser.save();
    
    console.log("✅ User Registered:", username);
    res.status(201).json(newUser);
  } catch (err) {
    console.error("❌ REGISTRATION ERROR:", err); // <--- This will show us the real error
    res.status(500).json(err);
  }
});

// LOGIN
router.post('/login', async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username });
    if (!user) return res.status(404).json("User not found!");

    if (user.password !== req.body.password) {
      return res.status(400).json("Wrong password!");
    }

    console.log("✅ User Logged In:", user.username);
    res.status(200).json(user);
  } catch (err) {
    console.error("❌ LOGIN ERROR:", err);
    res.status(500).json(err);
  }
});

module.exports = router;