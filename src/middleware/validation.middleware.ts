import { Request, Response, NextFunction } from "express";
import { validate, ValidationError } from "class-validator";
import { plainToInstance } from "class-transformer";
import { CreateWeatherDto } from "../dto/create-weather.dto";
import { UpdateWeatherDto } from "../dto/update-weather.dto";
import { RegisterDto, LoginDto } from "../dto/auth.dto";

export const validationMiddleware = (
  dtoClass: any,
  skipMissingProperties = false
) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const dtoObj = plainToInstance(dtoClass, req.body);

      const errors = await validate(dtoObj, {
        skipMissingProperties,
        whitelist: true,
        forbidNonWhitelisted: true,
        validationError: { target: false, value: false },
      });

      if (errors.length > 0) {
        const errorMessages = errors.map((error: ValidationError) => {
          if (error.constraints) {
            return Object.values(error.constraints).join(", ");
          }
          return "Validation error";
        });

        return res.status(400).json({
          success: false,
          error: "Validation failed",
          details: errorMessages,
        });
      }

      // اضافه کردن داده‌های validated به request
      req.body = dtoObj;
      next();
    } catch (error) {
      console.error("Validation middleware error:", error);
      res.status(500).json({
        success: false,
        error: "Internal server error during validation",
      });
    }
  };
};

export const validateCreateWeather = validationMiddleware(CreateWeatherDto);
export const validateUpdateWeather = validationMiddleware(
  UpdateWeatherDto,
  true
);
export const validateRegister = validationMiddleware(RegisterDto);
export const validateLogin = validationMiddleware(LoginDto);
