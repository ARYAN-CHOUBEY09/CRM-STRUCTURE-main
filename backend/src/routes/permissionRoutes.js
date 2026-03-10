import { Router } from "express";
import { getPermissionsByRole, upsertPermissionsByRole } from "../controllers/permissionController.js";
import { asyncHandler } from "../middleware/asyncHandler.js";

const router = Router();

router.get("/:role", asyncHandler(getPermissionsByRole));
router.put("/:role", asyncHandler(upsertPermissionsByRole));

export default router;
