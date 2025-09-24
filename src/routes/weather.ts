import { Router } from "express";
import { WeatherController } from "../controllers/WeatherController";
import { authenticateToken } from "../middleware/auth";

const router = Router();
const weatherController = new WeatherController();

router.get("/", authenticateToken, weatherController.getAllWeather);
router.get("/:id", authenticateToken, weatherController.getWeatherById);
router.get(
  "/latest/:cityName",
  authenticateToken,
  weatherController.getLatestWeatherByCity
);
router.post("/", authenticateToken, weatherController.createWeather);
router.put("/:id", authenticateToken, weatherController.updateWeather);
router.delete("/:id", authenticateToken, weatherController.deleteWeather);

export default router;
