import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { Permission } from "../models/Permission.js";

export const requireAuth = (req, res, next) => {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, env.jwtSecret);
    req.user = decoded;
    next();
  } catch (_error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

export const requireRole = (...allowedRoles) => (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  if (!allowedRoles.includes(req.user.role)) {
    return res.status(403).json({ message: "Forbidden" });
  }

  next();
};

export const requireAdmin = requireRole("Admin");

const hasModuleAccess = (value, requiredLevel) => {
  if (value === "Edit") {
    return true;
  }

  if (value === "View" && requiredLevel === "View") {
    return true;
  }

  return false;
};

export const requireModuleAccess = (moduleKey, requiredLevel) => async (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  if (req.user.role === "Admin") {
    return next();
  }

  const accessLevel =
    requiredLevel || (["GET", "HEAD", "OPTIONS"].includes(req.method) ? "View" : "Edit");

  let permissions = await Permission.findOne({ role: req.user.role });
  if (!permissions) {
    permissions = await Permission.create({ role: req.user.role });
  }
  const moduleAccess = permissions?.modules?.[moduleKey] || "No Access";

  if (!hasModuleAccess(moduleAccess, accessLevel)) {
    return res.status(403).json({ message: "Forbidden" });
  }

  req.modulePermissions = permissions?.modules || null;
  next();
};
