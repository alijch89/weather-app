import { IsOptional, IsDateString } from "class-validator";

export class BaseDto {
  @IsOptional()
  @IsDateString()
  createdAt?: Date;

  @IsOptional()
  @IsDateString()
  updatedAt?: Date;
}
