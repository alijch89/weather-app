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

  async getLatestWeatherByCity(cityName: string): Promise<Weather | null> {
    const cacheKey = `weather:latest:${cityName.toLowerCase()}`;

    // Try to get from cache first
    const cached = await this.redisService.get(cacheKey);
    if (cached) {
      return JSON.parse(cached);
    }

    const weather = await this.weatherRepository.findOne({
      where: { cityName: cityName.toLowerCase() },
      order: { fetchedAt: "DESC" },
    });

    if (weather) {
      // Cache for 10 minutes
      await this.redisService.set(cacheKey, JSON.stringify(weather), 600);
    }

    return weather;
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

  async updateWeatherRecord(
    id: string,
    updateData: Partial<Weather>
  ): Promise<Weather | null> {
    await this.weatherRepository.update(id, updateData);
    const updatedWeather = await this.getWeatherById(id);

    if (updatedWeather) {
      // Invalidate caches
      await this.redisService.del(
        `weather:latest:${updatedWeather.cityName.toLowerCase()}`
      );
      await this.redisService.del(`weather:${id}`);
    }

    return updatedWeather;
  }

  async deleteWeatherRecord(id: string): Promise<boolean> {
    const weather = await this.getWeatherById(id);
    if (!weather) return false;

    const result = await this.weatherRepository.delete(id);

    if (result.affected && result.affected > 0) {
      // Invalidate caches
      await this.redisService.del(
        `weather:latest:${weather.cityName.toLowerCase()}`
      );
      await this.redisService.del(`weather:${id}`);
      return true;
    }

    return false;
  }
}
