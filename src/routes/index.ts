import { Router } from "express";
import weatherRoutes from "./weather";
import authRoutes from "./auth";
import { notFoundHandler } from "../middleware/notFoundHandler";

const router = Router();

router.use("/weather", weatherRoutes);
router.use("/auth", authRoutes);
router.use(notFoundHandler);

export default router;
