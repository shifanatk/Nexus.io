const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
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
    if (!user) return res.status(404).json({ message: "User not found!" });

    if (user.password !== req.body.password) {
      return res.status(400).json({ message: "Wrong password!" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, username: user.username },
      process.env.JWT_SECRET || 'your-secret-key-change-in-production',
      { expiresIn: '7d' }
    );

    console.log("✅ User Logged In:", user.username);
    res.status(200).json({
      token,
      user: {
        _id: user._id,
        username: user.username,
        role: user.role
      }
    });
  } catch (err) {
    console.error("❌ LOGIN ERROR:", err);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;