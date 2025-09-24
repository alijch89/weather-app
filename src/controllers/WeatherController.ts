import { Request, Response } from "express";
import { WeatherService } from "../services/WeatherService";
import { validate } from "class-validator";
import { plainToInstance } from "class-transformer";
import { Weather } from "../entities/Weather";

export class WeatherController {
  private weatherService: WeatherService;

  constructor() {
    this.weatherService = new WeatherService();
  }

  getAllWeather = async (req: Request, res: Response): Promise<void> => {
    try {
      const weatherRecords = await this.weatherService.getAllWeatherRecords();
      res.json(weatherRecords);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch weather records" });
    }
  };

  getWeatherById = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const weather = await this.weatherService.getWeatherById(id);

      if (!weather) {
        res.status(404).json({ error: "Weather record not found" });
        return;
      }

      res.json(weather);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch weather record" });
    }
  };

  getLatestWeatherByCity = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const { cityName } = req.params;
      const weather = await this.weatherService.getLatestWeatherByCity(
        cityName
      );

      if (!weather) {
        res
          .status(404)
          .json({ error: `No weather data found for ${cityName}` });
        return;
      }

      res.json(weather);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch latest weather data" });
    }
  };

  createWeather = async (req: Request, res: Response): Promise<void> => {
    try {

      console.log("Request body:", req.body);
      
      const { cityName, country } = req.body;

      if (!cityName) {
        res.status(400).json({ error: "cityName is required" });
        return;
      }

      const weather = await this.weatherService.createWeatherRecord(
        cityName,
        country
      );
      res.status(201).json(weather);
    } catch (error: any) {
      console.log(error);
      
      if (error.message.includes("not found")) {
        res.status(404).json({ error: error.message });
      } else if (
        error.message.includes("API key") ||
        error.message.includes("rate limit")
      ) {
        res.status(503).json({ error: error.message });
      } else {
        res.status(500).json({ error: "Failed to create weather record" });
      }
    }
  };

  

  
}
