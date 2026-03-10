import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import { connectDB } from "../config/db.js";
import { env } from "../config/env.js";
import { User } from "../models/User.js";

const fullName = process.env.ADMIN_FULL_NAME || "Admin User";
const username = (process.env.ADMIN_USERNAME || "").trim().toLowerCase();
const password = process.env.ADMIN_PASSWORD || "";

const createAdmin = async () => {
  if (!username || !password) {
    throw new Error("ADMIN_USERNAME and ADMIN_PASSWORD are required");
  }

  await connectDB(env.mongoUri);

  const existingUser = await User.findOne({ username });
  if (existingUser) {
    if (existingUser.role !== "Admin") {
      existingUser.role = "Admin";
      existingUser.status = "Active";
      await existingUser.save();
      console.log(`User "${username}" promoted to Admin`);
    } else {
      console.log(`Admin "${username}" already exists`);
    }
    return;
  }

  const passwordHash = await bcrypt.hash(password, 10);

  await User.create({
    fullName,
    username,
    password: passwordHash,
    role: "Admin",
    status: "Active",
  });

  console.log(`Admin "${username}" created successfully`);
};

createAdmin()
  .catch((error) => {
    console.error("Failed to seed admin", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });
