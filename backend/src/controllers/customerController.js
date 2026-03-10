import { Customer } from "../models/Customer.js";

export const getCustomers = async (_req, res) => {
  const customers = await Customer.find().populate("assignedTo", "fullName username role").sort({ createdAt: -1 });
  res.json(customers);
};

export const getCustomerById = async (req, res) => {
  const customer = await Customer.findById(req.params.id).populate("assignedTo", "fullName username role");
  if (!customer) {
    return res.status(404).json({ message: "Customer not found" });
  }
  res.json(customer);
};

export const createCustomer = async (req, res) => {
  const { name, email, phone, company, source, status, assignedTo, notes } = req.body;

  if (!name) {
    return res.status(400).json({ message: "name is required" });
  }

  const customer = await Customer.create({
    name,
    email,
    phone,
    company,
    source,
    status,
    assignedTo: assignedTo || null,
    notes,
  });

  res.status(201).json({ message: "Customer created", customer });
};

export const updateCustomer = async (req, res) => {
  const { id } = req.params;
  const customer = await Customer.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });

  if (!customer) {
    return res.status(404).json({ message: "Customer not found" });
  }

  res.json({ message: "Customer updated", customer });
};

export const deleteCustomer = async (req, res) => {
  const { id } = req.params;
  const customer = await Customer.findByIdAndDelete(id);

  if (!customer) {
    return res.status(404).json({ message: "Customer not found" });
  }

  res.json({ message: "Customer deleted" });
};
