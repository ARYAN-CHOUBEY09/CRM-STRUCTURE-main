import { Router } from "express";
import { createLicense, deleteLicense, getLicenseById, getLicenses, updateLicense } from "../controllers/licenseController.js";
import { asyncHandler } from "../middleware/asyncHandler.js";

const router = Router();

router.get("/", asyncHandler(getLicenses));
router.get("/:id", asyncHandler(getLicenseById));
router.post("/", asyncHandler(createLicense));
router.put("/:id", asyncHandler(updateLicense));
router.delete("/:id", asyncHandler(deleteLicense));

export default router;
