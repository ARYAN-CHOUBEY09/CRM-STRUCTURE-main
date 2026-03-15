const API_BASE_URL = import.meta.env.VITE_API_URL || "/api";
const CUSTOMER_META_PREFIX = "__CRM_META__";

export const getStoredSession = () => {
  try {
    const raw = localStorage.getItem("crm_session");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export const setStoredSession = (session) => {
  localStorage.setItem("crm_session", JSON.stringify(session));
};

export const clearStoredSession = () => {
  localStorage.removeItem("crm_session");
};

const buildHeaders = (token, hasJsonBody = false) => {
  const headers = {};

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  if (hasJsonBody) {
    headers["Content-Type"] = "application/json";
  }

  return headers;
};

const request = async (path, { method = "GET", token, body } = {}) => {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers: buildHeaders(token, body !== undefined),
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(data?.message || `Request failed with status ${response.status}`);
  }

  return data;
};

const parseCustomerMeta = (notes = "") => {
  if (typeof notes !== "string") {
    return {};
  }

  if (!notes.startsWith(CUSTOMER_META_PREFIX)) {
    return { notes };
  }

  try {
    return JSON.parse(notes.slice(CUSTOMER_META_PREFIX.length));
  } catch {
    return { notes };
  }
};

const serializeCustomerMeta = (customer) =>
  `${CUSTOMER_META_PREFIX}${JSON.stringify({
    notes: customer.notes || "",
    subscription: customer.subscription || "",
    expiration: customer.expiration || "N/A",
    sale: customer.sale || "",
    payment: customer.payment || "",
  })}`;

export const normalizeCustomer = (customer) => {
  const meta = parseCustomerMeta(customer.notes);

  return {
    id: customer._id,
    name: customer.name || "",
    company: customer.company || "",
    email: customer.email || "",
    phone: customer.phone || "",
    source: customer.source || "",
    status: customer.status || "Lead",
    assigned: customer.assignedTo?.fullName || "",
    assignedTo: customer.assignedTo?._id || customer.assignedTo || "",
    subscription: meta.subscription || "",
    expiration: meta.expiration || "N/A",
    sale: meta.sale || "",
    payment: meta.payment || "",
    notes: meta.notes || "",
    createdAt: customer.createdAt,
  };
};

export const buildCustomerPayload = (customer) => ({
  name: customer.name,
  company: customer.company,
  email: customer.email,
  phone: customer.phone,
  source: customer.source,
  status: customer.status,
  assignedTo: customer.assignedTo || null,
  notes: serializeCustomerMeta(customer),
});

export const api = {
  login: (credentials) => request("/auth/login", { method: "POST", body: credentials }),
  getUsers: (token) => request("/users", { token }),
  createUser: (token, payload) => request("/users", { method: "POST", token, body: payload }),
  deleteUser: (token, id) => request(`/users/${id}`, { method: "DELETE", token }),
  getCustomers: async (token) => {
    const customers = await request("/customers", { token });
    return customers.map(normalizeCustomer);
  },
  createCustomer: async (token, payload) => {
    const data = await request("/customers", {
      method: "POST",
      token,
      body: buildCustomerPayload(payload),
    });
    return normalizeCustomer(data.customer);
  },
  updateCustomer: async (token, id, payload) => {
    const data = await request(`/customers/${id}`, {
      method: "PUT",
      token,
      body: buildCustomerPayload(payload),
    });
    return normalizeCustomer(data.customer);
  },
  deleteCustomer: (token, id) => request(`/customers/${id}`, { method: "DELETE", token }),
  getPermissionsByRole: (token, role) => request(`/permissions/${role}`, { token }),
  savePermissionsByRole: (token, role, modules) =>
    request(`/permissions/${role}`, { method: "PUT", token, body: { modules } }),
  getImportLogs: (token) => request("/imports", { token }),
  createImportLog: (token, payload) => request("/imports", { method: "POST", token, body: payload }),
};
