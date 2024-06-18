import express from 'express';
import loggerMiddleware from './middlewares/logger';
import serviceRouter from './routes/services';
import codesRouter from './routes/codes';
import cors from 'cors';

// import { connectToDb, getDb } from './db';
const app = express();

// Use the logger middleware for all routes
app.use(cors());
app.use(loggerMiddleware);
app.use(express.json())
app.use("/services", serviceRouter)
app.use("/codes", codesRouter)

export default app;
