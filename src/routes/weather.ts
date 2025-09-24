import { Router } from "express";
import { WeatherController } from "../controllers/WeatherController";
import { authenticateToken } from "../middleware/auth";
import { validateCreateWeather, validateUpdateWeather } from "../middleware/validation.middleware";

const router = Router();
const weatherController = new WeatherController();

router.get("/", authenticateToken, weatherController.getAllWeather);
router.get("/:id", authenticateToken, weatherController.getWeatherById);
router.get(
  "/latest/:cityName",
  authenticateToken,
  weatherController.getLatestWeatherByCity
);
router.post("/", validateCreateWeather, authenticateToken, weatherController.createWeather);
router.put("/:id", validateUpdateWeather, authenticateToken, weatherController.updateWeather);
router.delete("/:id", authenticateToken, weatherController.deleteWeather);

export default router;
