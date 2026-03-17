import mongoose from "mongoose";

const licenseSchema = new mongoose.Schema(
  {
    product: {
      type: String,
      required: true,
      trim: true,
    },
    licenseNumber: {
      type: String,
      required: true,
      trim: true,
    },
    productKey: {
      type: String,
      required: true,
      trim: true,
    },
    expiryDate: {
      type: String,
      trim: true,
      default: "N/A",
    },
  },
  { timestamps: true }
);

export const License = mongoose.model("License", licenseSchema);
