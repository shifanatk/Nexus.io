const mongoose = require('mongoose');

const SubspaceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  space: { type: mongoose.Schema.Types.ObjectId, ref: 'Space' },
  
  // EMBEDDED TASKS
  tasks: [{
    description: String,
    longDescription: { type: String, default: '' },
    status: { type: String, enum: ['Todo', 'Done'], default: 'Todo' },
    
    // ATTACHMENTS
    attachments: [{
      originalName: String,
      path: String,
      uploadedAt: { type: Date, default: Date.now }
    }],
    
    // COMMENTS
    comments: [{
      username: String,
      text: String,
      createdAt: { type: Date, default: Date.now }
    }]
  }]
});

module.exports = mongoose.model('Subspace', SubspaceSchema);