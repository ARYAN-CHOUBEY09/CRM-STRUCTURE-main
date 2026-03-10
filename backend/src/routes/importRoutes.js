import { Router } from "express";
import { createImportLog, getImportLogs } from "../controllers/importController.js";
import { asyncHandler } from "../middleware/asyncHandler.js";

const router = Router();

router.get("/", asyncHandler(getImportLogs));
router.post("/", asyncHandler(createImportLog));

export default router;
