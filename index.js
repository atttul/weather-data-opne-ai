import express from 'express';
import mongoDb from './db.js';
import weatherRouter from "./routes.js";
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();

const app = express();

// Connect to MongoDB (ensure this runs before requests)
await mongoDb();

// Middleware
app.use(cors({ origin: '*', allowedHeaders: ['Content-Type', 'Authorization'] }));
app.use(express.json());

// Routes
app.use('/api', weatherRouter);
app.get('/', (req, res) => {
    res.send('Welcome to the Weather Data API');
});

// ❌ REMOVE app.listen()
// ✅ Instead export the app for Vercel
export default app;
