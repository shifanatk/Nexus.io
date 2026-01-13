const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
//Routes
const authRoute = require('./routes/auth');
app.use('/api/auth', authRoute);
const spacesRoute = require('./routes/spaces');
app.use('/api/spaces', spacesRoute);
const subspacesRoute = require('./routes/subspaces');
app.use('/api/subspaces', subspacesRoute);
const messagesRoute = require('./routes/messages');
app.use('/api/messages', messagesRoute);
// Database Connection
// We use 127.0.0.1 to avoid common connection delays on Windows
mongoose.connect('mongodb://127.0.0.1:27017/workflowDB')
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.error("❌ MongoDB Error:", err));

// Test Route
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Start Server
const PORT = 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));