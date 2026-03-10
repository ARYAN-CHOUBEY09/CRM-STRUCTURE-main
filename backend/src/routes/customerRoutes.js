import { Router } from "express";
import { createCustomer, deleteCustomer, getCustomerById, getCustomers, updateCustomer } from "../controllers/customerController.js";
import { asyncHandler } from "../middleware/asyncHandler.js";

const router = Router();

router.get("/", asyncHandler(getCustomers));
router.get("/:id", asyncHandler(getCustomerById));
router.post("/", asyncHandler(createCustomer));
router.put("/:id", asyncHandler(updateCustomer));
router.delete("/:id", asyncHandler(deleteCustomer));

export default router;
