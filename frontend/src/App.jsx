import { useEffect, useState } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./layouts/Layout";
import { api, clearStoredSession, getStoredSession, setStoredSession } from "./lib/api";
import CreateCustomer from "./pages/CreateCustomer";
import Customers from "./pages/Customers";
import Dashboard from "./pages/Dashboard";
import EditCustomer from "./pages/EditCustomer";
import ImportData from "./pages/ImportData";
import Login from "./pages/Login";
import Permissions from "./pages/Permissions";
import Users from "./pages/UserManagement";

const FULL_ACCESS = {
  dashboard: "Edit",
  customers: "Edit",
  imports: "Edit",
  users: "Edit",
  permissions: "Edit",
};

const NO_ACCESS = {
  dashboard: "No Access",
  customers: "No Access",
  imports: "No Access",
  users: "No Access",
  permissions: "No Access",
};

const hasModuleAccess = (modules, moduleKey, requiredLevel = "View") => {
  const value = modules?.[moduleKey] || "No Access";

  if (value === "Edit") {
    return true;
  }

  if (value === "View" && requiredLevel === "View") {
    return true;
  }

  return false;
};

function App() {
  const [session, setSession] = useState(() => getStoredSession());
  const [customers, setCustomers] = useState([]);
  const [users, setUsers] = useState([]);
  const [permissions, setPermissions] = useState({ Manager: null, Staff: null });
  const [currentPermissions, setCurrentPermissions] = useState(NO_ACCESS);
  const [importLogs, setImportLogs] = useState([]);
  const [isBootstrapping, setIsBootstrapping] = useState(false);
  const [error, setError] = useState("");

  const token = session?.token || "";
  const currentUser = session?.user || null;

  const loadAppData = async (authToken) => {
    setIsBootstrapping(true);
    setError("");

    try {
      const isAdmin = currentUser?.role === "Admin";
      const rolePermissions = isAdmin
        ? { modules: FULL_ACCESS }
        : await api.getPermissionsByRole(authToken, currentUser?.role).catch(() => ({ modules: NO_ACCESS }));
      const activePermissions = rolePermissions?.modules || NO_ACCESS;
      setCurrentPermissions(activePermissions);

      const requests = [];

      if (isAdmin || hasModuleAccess(activePermissions, "users")) {
        requests.push(api.getUsers(authToken).then((data) => ({ key: "users", data })));
      }

      if (isAdmin || hasModuleAccess(activePermissions, "customers")) {
        requests.push(api.getCustomers(authToken).then((data) => ({ key: "customers", data })));
      }

      if (isAdmin || hasModuleAccess(activePermissions, "imports")) {
        requests.push(api.getImportLogs(authToken).then((data) => ({ key: "imports", data })));
      }

      if (isAdmin) {
        requests.push(api.getPermissionsByRole(authToken, "Manager").then((data) => ({ key: "managerPermissions", data })).catch(() => ({ key: "managerPermissions", data: null })));
        requests.push(api.getPermissionsByRole(authToken, "Staff").then((data) => ({ key: "staffPermissions", data })).catch(() => ({ key: "staffPermissions", data: null })));
      }

      const loaded = await Promise.all(requests);

      setUsers([]);
      setCustomers([]);
      setImportLogs([]);
      setPermissions({ Manager: null, Staff: null });

      loaded.forEach(({ key, data }) => {
        if (key === "users") {
          setUsers(data);
        }
        if (key === "customers") {
          setCustomers(data);
        }
        if (key === "imports") {
          setImportLogs(data);
        }
        if (key === "managerPermissions") {
          setPermissions((prev) => ({ ...prev, Manager: data?.modules || null }));
        }
        if (key === "staffPermissions") {
          setPermissions((prev) => ({ ...prev, Staff: data?.modules || null }));
        }
      });
    } catch (loadError) {
      clearStoredSession();
      setSession(null);
      setCurrentPermissions(NO_ACCESS);
      setError(loadError.message);
    } finally {
      setIsBootstrapping(false);
    }
  };

  useEffect(() => {
    if (token) {
      loadAppData(token);
    }
  }, [token]);

  const handleLogin = async (credentials) => {
    const nextSession = await api.login(credentials);
    setStoredSession(nextSession);
    setSession(nextSession);
    return nextSession;
  };

  const handleLogout = () => {
    clearStoredSession();
    setSession(null);
    setCustomers([]);
    setUsers([]);
    setCurrentPermissions(NO_ACCESS);
    setPermissions({ Manager: null, Staff: null });
    setImportLogs([]);
  };

  const addUser = async (newUser) => {
    const response = await api.createUser(token, newUser);
    setUsers((prev) => [response.user, ...prev]);
  };

  const deleteUser = async (id) => {
    await api.deleteUser(token, id);
    setUsers((prev) => prev.filter((user) => user.id !== id && user._id !== id));
  };

  const addCustomer = async (newCustomer) => {
    const createdCustomer = await api.createCustomer(token, newCustomer);
    setCustomers((prev) => [createdCustomer, ...prev]);
  };

  const updateCustomer = async (updatedData) => {
    const updatedCustomer = await api.updateCustomer(token, updatedData.id, updatedData);
    setCustomers((prev) => prev.map((customer) => (customer.id === updatedCustomer.id ? updatedCustomer : customer)));
  };

  const deleteCustomer = async (id) => {
    await api.deleteCustomer(token, id);
    setCustomers((prev) => prev.filter((customer) => customer.id !== id));
  };

  const savePermissions = async (role, modules) => {
    const response = await api.savePermissionsByRole(token, role, modules);
    setPermissions((prev) => ({ ...prev, [role]: response.permissions.modules }));
  };

  const createImportLog = async (payload) => {
    const response = await api.createImportLog(token, payload);
    setImportLogs((prev) => [response.importLog, ...prev]);
    return response.importLog;
  };

  const importCustomers = async ({ fileName, rows }) => {
    const results = await Promise.allSettled(rows.map((row) => api.createCustomer(token, row)));
    const successCustomers = results
      .filter((result) => result.status === "fulfilled")
      .map((result) => result.value);
    const successRows = successCustomers.length;
    const failedRows = results.length - successRows;
    const status = successRows > 0 && failedRows === 0 ? "Completed" : successRows > 0 ? "Completed" : "Failed";

    if (successCustomers.length > 0) {
      setCustomers((prev) => [...successCustomers, ...prev]);
    }

    await createImportLog({
      fileName,
      totalRows: rows.length,
      successRows,
      failedRows,
      status,
    });

    return { totalRows: rows.length, successRows, failedRows, status };
  };

  const activityItems = importLogs.map((log) => ({
    id: log._id,
    user: log.createdBy?.fullName || "System",
    action: "imported",
    target: log.fileName,
    time: new Date(log.createdAt).toLocaleString(),
    color: log.status === "Failed" ? "orange" : "green",
  }));

  const canViewDashboard = currentUser?.role === "Admin" || hasModuleAccess(currentPermissions, "dashboard");
  const canViewCustomers = currentUser?.role === "Admin" || hasModuleAccess(currentPermissions, "customers");
  const canEditCustomers = currentUser?.role === "Admin" || hasModuleAccess(currentPermissions, "customers", "Edit");
  const canViewImports = currentUser?.role === "Admin" || hasModuleAccess(currentPermissions, "imports");
  const canEditImports = currentUser?.role === "Admin" || hasModuleAccess(currentPermissions, "imports", "Edit");
  const canViewUsers = currentUser?.role === "Admin" || hasModuleAccess(currentPermissions, "users");
  const canEditUsers = currentUser?.role === "Admin" || hasModuleAccess(currentPermissions, "users", "Edit");
  const canViewPermissions = currentUser?.role === "Admin" || hasModuleAccess(currentPermissions, "permissions");
  const defaultAppPath = canViewDashboard
    ? "/app/dashboard"
    : canViewCustomers
      ? "/app/customers"
      : canViewImports
        ? "/app/import"
        : canViewUsers
          ? "/app/users"
          : "/";

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login onLogin={handleLogin} isAuthenticated={Boolean(token)} />} />
        <Route element={<ProtectedRoute isAuthenticated={Boolean(token)} />}>
          <Route
            path="/app"
            element={
              <Layout
                currentUser={currentUser}
                onLogout={handleLogout}
                isLoading={isBootstrapping}
                error={error}
                currentPermissions={currentPermissions}
              />
            }
          >
            <Route index element={<Navigate to={defaultAppPath.replace("/app/", "") || "/"} replace />} />
            {canViewDashboard ? <Route path="dashboard" element={<Dashboard customers={customers} activities={activityItems} />} /> : null}
            {canViewCustomers ? (
              <Route
                path="customers"
                element={<Customers customers={customers} onDelete={deleteCustomer} canEdit={canEditCustomers} canViewImports={canViewImports} />}
              />
            ) : null}
            {canEditCustomers ? <Route path="customers/create" element={<CreateCustomer onSave={addCustomer} users={users} />} /> : null}
            {canEditCustomers ? <Route path="customers/edit/:id" element={<EditCustomer customers={customers} onSave={updateCustomer} users={users} />} /> : null}
            {canViewImports ? <Route path="import" element={<ImportData logs={importLogs} onImportCustomers={importCustomers} canEdit={canEditImports} />} /> : null}
            {currentUser?.role === "Admin" && canViewPermissions ? (
              <Route path="permissions" element={<Permissions permissions={permissions} onSave={savePermissions} />} />
            ) : null}
            {canViewUsers ? <Route path="users" element={<Users users={users} onAddUser={addUser} onDeleteUser={deleteUser} canEdit={canEditUsers} />} /> : null}
            <Route path="*" element={<Navigate to={defaultAppPath} replace />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
