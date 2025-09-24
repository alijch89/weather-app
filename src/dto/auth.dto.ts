import { IsEmail, IsNotEmpty, MinLength, IsString } from "class-validator";

export class RegisterDto {
  @IsNotEmpty({ message: "Email is required" })
  @IsEmail({}, { message: "Please provide a valid email address" })
  email!: string;

  @IsNotEmpty({ message: "Password is required" })
  @IsString({ message: "Password must be a string" })
  @MinLength(6, { message: "Password must be at least 6 characters long" })
  password!: string;
}

export class LoginDto {
  @IsNotEmpty({ message: "Email is required" })
  @IsEmail({}, { message: "Please provide a valid email address" })
  email!: string;

  @IsNotEmpty({ message: "Password is required" })
  @IsString({ message: "Password must be a string" })
  password!: string;
}
