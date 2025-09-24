import {
  IsOptional,
  IsNumber,
  Min,
  Max,
  IsString,
  IsNotEmpty,
  IsISO31661Alpha2,
} from "class-validator";
import { Type } from "class-transformer";

export class UpdateWeatherDto {
  @IsNotEmpty({ message: "cityName is required" })
  @IsString({ message: "cityName must be a string" })
  cityName: string;

  @IsNotEmpty({ message: "country is required" })
  @IsString({ message: "country must be a string" })
  @IsISO31661Alpha2({
    message: "country must be a valid ISO 3166-1 alpha-2 country code",
  })
  country: string;

  @IsOptional()
  @IsNumber({}, { message: "temperature must be a number" })
  @Type(() => Number)
  temperature?: number;

  @IsOptional()
  @IsString({ message: "description must be a string" })
  description?: string;

  @IsOptional()
  @IsNumber({}, { message: "humidity must be a number" })
  @Min(0, { message: "humidity must be at least 0" })
  @Max(100, { message: "humidity must be at most 100" })
  @Type(() => Number)
  humidity?: number;

  @IsOptional()
  @IsNumber({}, { message: "windSpeed must be a number" })
  @Min(0, { message: "windSpeed cannot be negative" })
  @Type(() => Number)
  windSpeed?: number;
}
