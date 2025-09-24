import { Router } from "express";
import { AuthController } from "../controllers/AuthController";
import {
  validateLogin,
  validateRegister,
} from "../middleware/validation.middleware";

const router = Router();
const authController = new AuthController();

router.post("/register", validateRegister, authController.register);
router.post("/login", validateLogin, authController.login);

export default router;
