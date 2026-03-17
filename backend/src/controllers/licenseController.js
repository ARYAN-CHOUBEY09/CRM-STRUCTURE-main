import { License } from "../models/License.js";

export const getLicenses = async (_req, res) => {
  const licenses = await License.find().sort({ createdAt: -1 });
  res.json(licenses);
};

export const getLicenseById = async (req, res) => {
  const license = await License.findById(req.params.id);

  if (!license) {
    return res.status(404).json({ message: "License not found" });
  }

  res.json(license);
};

export const createLicense = async (req, res) => {
  const { product, licenseNumber, productKey, expiryDate } = req.body;

  if (!product || !licenseNumber || !productKey) {
    return res.status(400).json({ message: "product, licenseNumber, and productKey are required" });
  }

  const license = await License.create({
    product,
    licenseNumber,
    productKey,
    expiryDate: expiryDate || "N/A",
  });

  res.status(201).json({ message: "License created", license });
};

export const updateLicense = async (req, res) => {
  const { id } = req.params;
  const license = await License.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });

  if (!license) {
    return res.status(404).json({ message: "License not found" });
  }

  res.json({ message: "License updated", license });
};

export const deleteLicense = async (req, res) => {
  const { id } = req.params;
  const license = await License.findByIdAndDelete(id);

  if (!license) {
    return res.status(404).json({ message: "License not found" });
  }

  res.json({ message: "License deleted" });
};
