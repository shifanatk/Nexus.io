const mongoose = require('mongoose');

const SpaceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  
  // Who owns this space?
  owner: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    required: true
  },

  // NEW: Who else is allowed here? (The Team)
  members: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  }], 

  // The actual tasks inside
  // Enhanced Tasks
  tasks: [{
    description: String, // The short title
    longDescription: { type: String, default: '' }, // NEW: The details
    status: { type: String, enum: ['Pending', 'Done'], default: 'Pending' },
    
    // NEW: Chat specific to this task
    comments: [{
      sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      username: String,
      text: String,
      createdAt: { type: Date, default: Date.now }
    }]
  }]
});

module.exports = mongoose.model('Space', SpaceSchema);