import bcrypt from "bcryptjs";
import { User } from "../models/User.js";
import { signToken } from "../utils.js";

export const register = async (req, res) => {
  const { fullName, username, password, role } = req.body;

  if (!fullName || !username || !password) {
    return res.status(400).json({ message: "fullName, username and password are required" });
  }

  const existing = await User.findOne({ username: username.toLowerCase() });
  if (existing) {
    return res.status(409).json({ message: "Username already exists" });
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const user = await User.create({
    fullName,
    username,
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

  if (!username || !password) {
    return res.status(400).json({ message: "username and password are required" });
  }

  const user = await User.findOne({ username: username.toLowerCase() });
  if (!user) {
    return res.status(401).json({ message: "Invalid credentials" });
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
