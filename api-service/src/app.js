import express from 'express';
import dotenv from 'dotenv';
import userRoutes from './controllers/userController.js';
import dataRoutes from './controllers/dataController.js';

dotenv.config();

const app = express();
app.use(express.json());

// Root route (health check)
app.get('/', (req, res) => {
  res.send('🚀 API is running');
});

// API routes
app.use('/user', userRoutes);
app.use('/data', dataRoutes);

export default app;
