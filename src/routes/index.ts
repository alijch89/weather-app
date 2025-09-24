import { Router } from "express";
import weatherRoutes from "./weather";
import authRoutes from "./auth";

const router = Router();

router.use("/weather", weatherRoutes);
router.use("/auth", authRoutes);

export default router;
