import { Router } from "express";
import { createUser, deleteUser, getUsers, updateUser } from "../controllers/userController.js";
import { asyncHandler } from "../middleware/asyncHandler.js";

const router = Router();

router.get("/", asyncHandler(getUsers));
router.post("/", asyncHandler(createUser));
router.put("/:id", asyncHandler(updateUser));
router.delete("/:id", asyncHandler(deleteUser));

export default router;
