import { Router } from "express";
import { WeatherController } from "../controllers/WeatherController";

const router = Router();
const weatherController = new WeatherController();

router.get("/", weatherController.getAllWeather);
router.get("/:id", weatherController.getWeatherById);
router.get("/latest/:cityName", weatherController.getLatestWeatherByCity);
router.post("/", weatherController.createWeather);
router.put("/:id", weatherController.updateWeather);
router.delete("/:id", weatherController.deleteWeather);

export { router as weatherRoutes };
