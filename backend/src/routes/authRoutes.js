import { Router } from "express";
import { login, register } from "../controllers/authController.js";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { requireAdmin, requireAuth } from "../middleware/authMiddleware.js";

const router = Router();

router.post("/register", requireAuth, requireAdmin, asyncHandler(register));
router.post("/login", asyncHandler(login));

export default router;
