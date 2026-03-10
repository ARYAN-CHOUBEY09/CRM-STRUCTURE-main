import mongoose from "mongoose";

const importLogSchema = new mongoose.Schema(
  {
    fileName: {
      type: String,
      required: true,
      trim: true,
    },
    totalRows: {
      type: Number,
      default: 0,
    },
    successRows: {
      type: Number,
      default: 0,
    },
    failedRows: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ["Pending", "Completed", "Failed"],
      default: "Pending",
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  { timestamps: true }
);

export const ImportLog = mongoose.model("ImportLog", importLogSchema);
