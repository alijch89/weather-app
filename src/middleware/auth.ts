// src/middleware/auth.ts
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env";

export interface AuthRequest extends Request {
  user?: {
    userId: string;
    email: string;
  };
}

export const authenticateToken = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    res.status(401).json({
      success: false,
      error: "Access token required",
    });
    return;
  }

  jwt.verify(
    token,
    env.jwt?.secret || "fallback-secret",
    (err: any, user: any) => {
      if (err) {
        res.status(403).json({
          success: false,
          error: "Invalid or expired token",
        });
        return;
      }
      req.user = user;
      next();
    }
  );
};

export const optionalAuth = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token) {
    jwt.verify(
      token,
      env.jwt?.secret || "fallback-secret",
      (err: any, user: any) => {
        if (!err) {
          req.user = user;
        }
      }
    );
  }
  next();
};
