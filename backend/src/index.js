const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const dotenv = require('dotenv');

// Import routes
const userRoutes = require('./routes/userRoutes');
const warehouseRoutes = require('./routes/warehouseRoutes');
const inventoryRoutes = require('./routes/inventoryRoutes');
const reportRoutes = require('./routes/reportRoutes');
const settingsRoutes = require('./routes/settingsRoutes');

// Load environment variables
dotenv.config();

const app = express();
const server = http.createServer(app);

// Configure CORS for Socket.IO
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"]
  }
});

// Middleware
app.use(cors());
app.use(express.json());

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('🔌 Client connected:', socket.id);

  socket.on('disconnect', () => {
    console.log('❌ Client disconnected:', socket.id);
  });

  // Handle inventory events
  socket.on('inventory:create', (data) => {
    console.log('📦 New product created:', data);
    io.emit('inventory:created', data);
  });

  socket.on('inventory:update', (data) => {
    console.log('📦 Product updated:', data);
    io.emit('inventory:updated', data);
  });

  socket.on('inventory:delete', (data) => {
    console.log('📦 Product deleted:', data);
    io.emit('inventory:deleted', data);
  });
});

// Routes
app.use('/api/users', userRoutes);
app.use('/api/warehouses', warehouseRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/settings', settingsRoutes);

// MongoDB Connection
const MONGODB_URI = 'mongodb+srv://rachit:rachit@inventory.dlk4kem.mongodb.net/inventory';
mongoose.connect(MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Socket.IO server is running at ws://localhost:${PORT}/socket.io`);
});

// Export io instance for use in routes
module.exports = { io }; 