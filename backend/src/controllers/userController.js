import bcrypt from "bcryptjs";
import { User } from "../models/User.js";

export const getUsers = async (_req, res) => {
  const users = await User.find().select("-password").sort({ createdAt: -1 });
  res.json(users);
};

export const createUser = async (req, res) => {
  const { fullName, username, password, role, status } = req.body;

  if (!fullName || !username || !password) {
    return res.status(400).json({ message: "fullName, username and password are required" });
  }

  const existing = await User.findOne({ username: username.toLowerCase() });
  if (existing) {
    return res.status(409).json({ message: "Username already exists" });
  }

  if (req.user?.role !== "Admin" && role === "Admin") {
    return res.status(403).json({ message: "Forbidden" });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await User.create({
    fullName,
    username,
    password: passwordHash,
    role: role || "Staff",
    status: status || "Active",
  });

  res.status(201).json({
    message: "User created",
    user: {
      id: user._id,
      fullName: user.fullName,
      username: user.username,
      role: user.role,
      status: user.status,
      createdAt: user.createdAt,
    },
  });
};

export const updateUser = async (req, res) => {
  const { id } = req.params;
  const { fullName, role, status, password } = req.body;

  const user = await User.findById(id);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  if (req.user?.role !== "Admin" && role === "Admin") {
    return res.status(403).json({ message: "Forbidden" });
  }

  if (fullName !== undefined) user.fullName = fullName;
  if (role !== undefined) user.role = role;
  if (status !== undefined) user.status = status;
  if (password) {
    user.password = await bcrypt.hash(password, 10);
  }

  await user.save();

  res.json({ message: "User updated" });
};

export const deleteUser = async (req, res) => {
  const { id } = req.params;
  const user = await User.findByIdAndDelete(id);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  res.json({ message: "User deleted" });
};
