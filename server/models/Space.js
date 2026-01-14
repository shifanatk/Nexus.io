const mongoose = require('mongoose');

const SpaceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  subspaces: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Subspace' }],
  
  // --- NEW: WORKSPACE LEVEL TASKS ---
  tasks: [{
    description: String,
    longDescription: { type: String, default: '' },
    status: { type: String, enum: ['Todo', 'Done'], default: 'Todo' },
    
    attachments: [{
      originalName: String,
      path: String,
      uploadedAt: { type: Date, default: Date.now }
    }],
    
    comments: [{
      username: String,
      text: String,
      createdAt: { type: Date, default: Date.now }
    }]
  }],

  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Space', SpaceSchema);