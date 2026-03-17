import mongoose from "mongoose";

const permissionSchema = new mongoose.Schema(
  {
    role: {
      type: String,
      enum: ["Admin", "Manager", "Staff"],
      required: true,
      unique: true,
    },
    modules: {
      dashboard: { type: String, default: "View" },
      customers: { type: String, default: "Edit" },
      licenses: { type: String, default: "Edit" },
      imports: { type: String, default: "View" },
      users: { type: String, default: "No Access" },
      permissions: { type: String, default: "No Access" },
    },
  },
  { timestamps: true }
);

export const Permission = mongoose.model("Permission", permissionSchema);
