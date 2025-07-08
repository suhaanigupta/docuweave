import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

import explainRouter from './routes/explain.js';
import uploadPdfRoute from './routes/uploadPdf.js';
import authRoutes from './routes/auth.js';

dotenv.config();

const app = express();

// ✅ Explicit CORS config - THIS IS THE CRITICAL PART
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);

      // Allow deployed Netlify frontend
      const deployedFrontend = 'https://docuweave.netlify.app';

      // Allow any localhost port for development
      if (origin.startsWith('http://localhost:')) {
        return callback(null, true);
      }

      // Allow the specific deployed frontend
      if (origin === deployedFrontend) {
        return callback(null, true);
      }

      // Block all other origins
      const msg = `The CORS policy for this site does not allow access from the specified Origin: ${origin}`;
      return callback(new Error(msg), false);
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Added PUT/DELETE for completeness
    allowedHeaders: ['Content-Type', 'Authorization'], // Added Authorization for login/register
    credentials: true,
  })
);

// Parse JSON bodies
app.use(express.json());

// ✅ Route imports
app.use('/api', explainRouter);
app.use('/api', uploadPdfRoute);
app.use('/api', authRoutes);

// Health check route
app.get('/ping', (req, res) => {
  res.send('pong');
});

// Start server
app.listen(5050, () => {
  console.log('✅ Server running on http://localhost:5050 - CORS: Dynamic Localhost Enabled!'); // <--- NEW UNIQUE LOG MESSAGE
});
