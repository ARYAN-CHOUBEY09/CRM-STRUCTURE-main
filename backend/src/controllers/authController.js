import bcrypt from "bcryptjs";
import { User } from "../models/User.js";
import { signToken } from "../utils.js";

export const register = async (req, res) => {
  const { fullName, username, password, role } = req.body;
  const normalizedUsername = username?.trim().toLowerCase();
  const normalizedFullName = fullName?.trim();

  if (!normalizedFullName || !normalizedUsername || !password) {
    return res.status(400).json({ message: "fullName, username and password are required" });
  }

  const existing = await User.findOne({ username: normalizedUsername });
  if (existing) {
    return res.status(409).json({ message: "Username already exists" });
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const user = await User.create({
    fullName: normalizedFullName,
    username: normalizedUsername,
    password: passwordHash,
    role: role || "Staff",
  });

  return res.status(201).json({
    message: "User created",
    user: {
      id: user._id,
      fullName: user.fullName,
      username: user.username,
      role: user.role,
      status: user.status,
    },
  });
};

export const login = async (req, res) => {
  const { username, password } = req.body;
  const normalizedUsername = username?.trim().toLowerCase();

  if (!normalizedUsername || !password) {
    return res.status(400).json({ message: "username and password are required" });
  }

  const user = await User.findOne({ username: normalizedUsername });
  if (!user) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  if (user.status !== "Active") {
    return res.status(403).json({ message: "User account is inactive" });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const token = signToken({ userId: user._id.toString(), role: user.role });

  return res.json({
    token,
    user: {
      id: user._id,
      fullName: user.fullName,
      username: user.username,
      role: user.role,
      status: user.status,
    },
  });
};
