import { ImportLog } from "../models/ImportLog.js";

export const createImportLog = async (req, res) => {
  const { fileName, totalRows, successRows, failedRows, status } = req.body;

  if (!fileName) {
    return res.status(400).json({ message: "fileName is required" });
  }

  const importLog = await ImportLog.create({
    fileName,
    totalRows: totalRows || 0,
    successRows: successRows || 0,
    failedRows: failedRows || 0,
    status: status || "Pending",
    createdBy: req.user?.userId || null,
  });

  res.status(201).json({ message: "Import log created", importLog });
};

export const getImportLogs = async (_req, res) => {
  const logs = await ImportLog.find().populate("createdBy", "fullName username").sort({ createdAt: -1 });
  res.json(logs);
};
