import { Router } from "express";
import { WeatherController } from "../controllers/WeatherController";
import { authenticateToken } from "../middleware/auth";

const router = Router();
const weatherController = new WeatherController();

router.get("/", authenticateToken, weatherController.getAllWeather);
router.get("/:id", weatherController.getWeatherById);
router.get("/latest/:cityName", weatherController.getLatestWeatherByCity);
router.post("/", weatherController.createWeather);
router.put("/:id", weatherController.updateWeather);
router.delete("/:id", weatherController.deleteWeather);

export default router;
