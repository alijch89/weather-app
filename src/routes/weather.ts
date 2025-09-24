import { Router } from "express";
import { WeatherController } from "../controllers/WeatherController";

const router = Router();
const weatherController = new WeatherController();

router.post("/", weatherController.createWeather);

export { router as weatherRoutes };
