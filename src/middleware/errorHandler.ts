import { Request, Response, NextFunction } from "express";

export const errorHandler = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  console.error("Error:", error);

  if (error.name === "ValidationError") {
    res.status(400).json({ error: "Validation failed", details: error.errors });
    return;
  }

  if (error.code === "23505") {
    // PostgreSQL unique violation
    res.status(409).json({ error: "Resource already exists" });
    return;
  }

  res.status(error.status || 500).json({
    error: error.message || "Internal server error",
  });
};
