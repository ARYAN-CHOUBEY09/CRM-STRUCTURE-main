import { Router } from "express";
import authRoutes from "./authRoutes.js";
import customerRoutes from "./customerRoutes.js";
import importRoutes from "./importRoutes.js";
import permissionRoutes from "./permissionRoutes.js";
import userRoutes from "./userRoutes.js";
import { requireAuth, requireModuleAccess } from "../middleware/authMiddleware.js";

const router = Router();

router.get("/health", (_req, res) => {
  res.json({ ok: true, message: "CRM backend is running" });
});

router.use("/auth", authRoutes);
router.use("/users", requireAuth, requireModuleAccess("users"), userRoutes);
router.use("/customers", requireAuth, requireModuleAccess("customers"), customerRoutes);
router.use("/permissions", requireAuth, permissionRoutes);
router.use("/imports", requireAuth, requireModuleAccess("imports"), importRoutes);

export default router;
