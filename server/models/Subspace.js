const mongoose = require('mongoose');

const SubspaceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  
  // Link to the main Workspace
  parentSpace: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Space', 
    required: true 
  },

  // The "VIP List" (Only these users can see/edit this subspace)
  members: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  }], 

  // Tasks specific to this subspace
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

module.exports = mongoose.model('Subspace', SubspaceSchema);