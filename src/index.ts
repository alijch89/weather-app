import "reflect-metadata";
import express from "express";
import cors from "cors";
import helmet from "helmet";

import { env } from "./config/env";
import { initializeDatabase } from "./config/database";

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const startServer = async (): Promise<void> => {
  try {
    await initializeDatabase();

    app.listen(env.port, () => {
      console.log(`Server running on port ${env.port}`);
      console.log(`Environment: ${env.nodeEnv}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();

export default app;
