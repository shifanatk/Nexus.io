const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
  // Who sent it?
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  username: { type: String, required: true }, // Store name for faster display

  // Where does this message belong? (It will have EITHER a spaceId OR a subspaceId)
  spaceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Space' },
  subspaceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Subspace' },

  content: { type: String, required: true },
  
  // Is this a normal chat or an official notice?
  type: { type: String, enum: ['chat', 'notice'], default: 'chat' },
  
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Message', MessageSchema);