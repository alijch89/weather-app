import { Router } from "express";
import { WeatherController } from "../controllers/WeatherController";

const router = Router();
const weatherController = new WeatherController();

router.get("/", weatherController.getAllWeather);
router.get("/:id", weatherController.getWeatherById);
router.post("/", weatherController.createWeather);

export { router as weatherRoutes };
