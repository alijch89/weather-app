import { config } from "dotenv";

config();

export const env = {
  port: process.env.PORT || 3000,
  database: {
    host: process.env.DB_HOST || "localhost",
    port: parseInt(process.env.DB_PORT || "5432"),
    username: process.env.DB_USERNAME || "postgres",
    password: process.env.DB_PASSWORD || "password",
    database: process.env.DB_NAME || "weather_db",
  },
  nodeEnv: process.env.NODE_ENV || "development",
};
