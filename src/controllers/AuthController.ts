import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { validate } from "class-validator";
import { AppDataSource } from "../config/database";
import { User } from "../entities/User";
import { env } from "../config/env";

export class AuthController {
  private userRepository = AppDataSource.getRepository(User);

  register = async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, password } = req.body;

      // بررسی وجود کاربر
      const existingUser = await this.userRepository.findOne({
        where: { email },
      });
      if (existingUser) {
        res.status(400).json({
          success: false,
          error: "User already exists with this email",
        });
        return;
      }

      // ایجاد کاربر جدید
      const user = new User();
      user.email = email;
      user.password = password;

      // اعتبارسنجی
      const errors = await validate(user);
      if (errors.length > 0) {
        res.status(400).json({
          success: false,
          error: "Validation failed",
          details: errors
            .map(error => Object.values(error.constraints || {}))
            .flat(),
        });
        return;
      }

      // ذخیره کاربر
      await this.userRepository.save(user);

      // ایجاد توکن
      const token = jwt.sign(
        { userId: user.id, email: user.email },
        env.jwt?.secret || "fallback-secret",
        { expiresIn: env.jwt?.expiresIn || "1h" }
      );

      res.status(201).json({
        success: true,
        message: "User registered successfully",
        data: {
          user: {
            id: user.id,
            email: user.email,
            createdAt: user.createdAt,
          },
          token,
        },
      });
    } catch (error) {
      console.error("Registration error:", error);
      res.status(500).json({
        success: false,
        error: "Failed to register user",
      });
    }
  };

  login = async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, password } = req.body;

      // پیدا کردن کاربر
      const user = await this.userRepository.findOne({ where: { email } });
      if (!user) {
        res.status(401).json({
          success: false,
          error: "Invalid email or password",
        });
        return;
      }

      // بررسی پسورد
      const isValidPassword = await user.comparePassword(password);
      if (!isValidPassword) {
        res.status(401).json({
          success: false,
          error: "Invalid email or password",
        });
        return;
      }

      // ایجاد توکن
      const token = jwt.sign(
        { userId: user.id, email: user.email },
        env.jwt?.secret || "fallback-secret",
        { expiresIn: env.jwt?.expiresIn || "1h" }
      );

      res.json({
        success: true,
        message: "Login successful",
        data: {
          user: {
            id: user.id,
            email: user.email,
            createdAt: user.createdAt,
          },
          token,
        },
      });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({
        success: false,
        error: "Failed to login",
      });
    }
  };

  getProfile = async (req: Request, res: Response): Promise<void> => {
    try {
      // کاربر از middleware auth اضافه شده است
      const user = (req as any).user;

      const userData = await this.userRepository.findOne({
        where: { id: user.userId },
        select: ["id", "email", "createdAt", "updatedAt"],
      });

      if (!userData) {
        res.status(404).json({
          success: false,
          error: "User not found",
        });
        return;
      }

      res.json({
        success: true,
        data: userData,
      });
    } catch (error) {
      console.error("Profile error:", error);
      res.status(500).json({
        success: false,
        error: "Failed to get profile",
      });
    }
  };
}
