import mongoose from 'mongoose';
import dotenv from 'dotenv';
import app from './app.js';

dotenv.config();

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('✅ MongoDB connected');
    app.listen(process.env.PORT, () => {
      console.log(`🚀 API running on port ${process.env.PORT}`);
    });
  })
  .catch(err => {
    console.error('❌ MongoDB error', err);
    process.exit(1);
  });
