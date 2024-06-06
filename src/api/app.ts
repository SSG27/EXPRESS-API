import express, { Request, Response } from 'express';
import loggerMiddleware from './middlewares/logger';
import CCode from "./models/ccModel";
import SService from "./models/ssModel";
import serviceRouter from './routes/services';
import codesRouter from './routes/codes';

// import { connectToDb, getDb } from './db';
const app = express();

// Use the logger middleware for all routes
app.use(loggerMiddleware);
app.use(express.json())
app.use("/services", serviceRouter)
app.use("/codes", codesRouter)








  async function updateCountryCode(countryName: string, newCode: string, newServices: number[]) {
    const updateResult = await CCode.updateOne(
      { country: countryName },
      {
        $set: {
          code: newCode,
          services: newServices,
        },
      }
    );
  
    if (updateResult.modifiedCount === 1) {
      console.log(`Country code for ${countryName} updated successfully.`);
    } else {
      console.log(`Country code for ${countryName} not found or no changes made.`);
    }
  }

  async function deleteStreamingService(serviceId: string) {
    const deleteResult = await SService.deleteOne({ id: serviceId });
  
    if (deleteResult.deletedCount === 1) {
      console.log(`Streaming service with ID ${serviceId} deleted successfully.`);
    } else {
      console.log(`Streaming service with ID ${serviceId} not found or no changes made.`);
    }
  }

export default app;
