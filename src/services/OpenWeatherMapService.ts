import axios from "axios";
import { env } from "../config/env";

export interface WeatherData {
  cityName: string;
  country: string;
  temperature: number;
  description: string;
  humidity: number;
  windSpeed: number;
  fetchedAt: Date;
}

export class OpenWeatherMapService {
  private apiKey = env.openWeatherMap.apiKey;

  async getCurrentWeather(
    cityName: string,
    country?: string
  ): Promise<WeatherData> {
    if (!this.apiKey) {
      throw new Error("OpenWeatherMap API key is not configured");
    }

    const query = country ? `${cityName},${country}` : cityName;
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
      query
    )}&appid=${this.apiKey}&units=metric`;
    try {
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();

      return {
        cityName: data.name,
        country: data.sys.country,
        temperature: data.main.temp,
        description: data.weather[0].description,
        humidity: data.main.humidity,
        windSpeed: data.wind.speed,
        fetchedAt: new Date(),
      };
    } catch (error: any) {
      console.log(error);

      if (error.response?.status === 404) {
        throw new Error(`City not found: ${cityName}`);
      }
      if (error.response?.status === 401) {
        throw new Error("Invalid OpenWeatherMap API key");
      }
      if (error.response?.status === 429) {
        throw new Error("OpenWeatherMap API rate limit exceeded");
      }
      throw new Error(`Failed to fetch weather data: ${error.message}`);
    }
  }

}
