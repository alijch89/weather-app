import { Repository } from "typeorm";
import { AppDataSource } from "../config/database";
import { Weather } from "../entities/Weather";
import { OpenWeatherMapService, WeatherData } from "./OpenWeatherMapService";
import { RedisService } from "./RedisService";

export class WeatherService {
  private weatherRepository: Repository<Weather>;
  private openWeatherService: OpenWeatherMapService;
  private redisService: RedisService;

  constructor() {
    this.weatherRepository = AppDataSource.getRepository(Weather);
    this.openWeatherService = new OpenWeatherMapService();
    this.redisService = new RedisService();
  }

  async getAllWeatherRecords(): Promise<Weather[]> {
    return this.weatherRepository.find({
      order: { createdAt: "DESC" },
    });
  }

  async getWeatherById(id: string): Promise<Weather | null> {
    return this.weatherRepository.findOne({ where: { id } });
  }

  

  async createWeatherRecord(
    cityName: string,
    country: string
  ): Promise<Weather> {
    const cacheKey = `weather:external:${cityName}:${country}`;

    // Try to get from cache to avoid API calls
    const cached = await this.redisService.get(cacheKey);
    let weatherData: WeatherData;

    if (cached) {
      weatherData = JSON.parse(cached);
    } else {
      weatherData = await this.openWeatherService.getCurrentWeather(
        cityName,
        country
      );
      // Cache external API response for 10 minutes
      await this.redisService.set(cacheKey, JSON.stringify(weatherData), 600);
    }

    const weather = new Weather();
    weather.cityName = weatherData.cityName.toLowerCase();
    weather.country = weatherData.country;
    weather.temperature = weatherData.temperature;
    weather.description = weatherData.description;
    weather.humidity = weatherData.humidity;
    weather.windSpeed = weatherData.windSpeed;
    weather.fetchedAt = weatherData.fetchedAt;
    weather.cityCountry = `${weatherData.cityName.toLowerCase()}_${
      weatherData.country
    }`;

    const savedWeather = await this.weatherRepository.save(weather);

    // Invalidate latest weather cache for this city
    await this.redisService.del(`weather:latest:${cityName.toLowerCase()}`);

    return savedWeather;
  }

  

  
}
