import { IsNotEmpty, IsString, IsISO31661Alpha2 } from "class-validator";

export class CreateWeatherDto {
  @IsNotEmpty({ message: "cityName is required" })
  @IsString({ message: "cityName must be a string" })
  cityName: string;

  @IsNotEmpty({ message: "country is required" })
  @IsString({ message: "country must be a string" })
  @IsISO31661Alpha2({
    message: "country must be a valid ISO 3166-1 alpha-2 country code",
  })
  country: string;
}
