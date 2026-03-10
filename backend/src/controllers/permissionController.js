import { Permission } from "../models/Permission.js";

export const getPermissionsByRole = async (req, res) => {
  const role = req.params.role;

  if (req.user?.role !== "Admin" && req.user?.role !== role) {
    return res.status(403).json({ message: "Forbidden" });
  }

  let permissions = await Permission.findOne({ role });
  if (!permissions) {
    permissions = await Permission.create({ role });
  }

  res.json(permissions);
};

export const upsertPermissionsByRole = async (req, res) => {
  const role = req.params.role;
  const { modules } = req.body;

  if (req.user?.role !== "Admin") {
    return res.status(403).json({ message: "Forbidden" });
  }

  const permissions = await Permission.findOneAndUpdate(
    { role },
    { role, modules },
    { new: true, upsert: true, runValidators: true }
  );

  res.json({ message: "Permissions saved", permissions });
};
