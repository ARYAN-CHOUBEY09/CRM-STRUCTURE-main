import { useState } from "react";
import "../styles/Permissions.css";

const PERMISSION_OPTIONS = [
  { value: "No Access", label: "No Access", color: "red" },
  { value: "View", label: "View", color: "orange" },
  { value: "Edit", label: "Edit", color: "green" },
];

const modules = [
  { key: "dashboard", label: "Dashboard" },
  { key: "customers", label: "Customers" },
  { key: "licenses", label: "Licenses" },
  { key: "imports", label: "Imports" },
  { key: "users", label: "Users" },
  { key: "permissions", label: "Permissions" },
];

const defaultModules = {
  dashboard: "View",
  customers: "Edit",
  licenses: "Edit",
  imports: "View",
  users: "No Access",
  permissions: "No Access",
};

export default function Permissions({ permissions, onSave }) {
  const [open, setOpen] = useState(null);
  const [localPermissions, setLocalPermissions] = useState({
    Manager: { ...defaultModules, ...(permissions.Manager || {}) },
    Staff: { ...defaultModules, ...(permissions.Staff || {}) },
  });

  const updatePermission = async (role, key, value) => {
    const nextRolePermissions = {
      ...localPermissions[role],
      [key]: value,
    };

    setLocalPermissions((prev) => ({
      ...prev,
      [role]: nextRolePermissions,
    }));
    setOpen(null);
    await onSave(role, nextRolePermissions);
  };

  return (
    <div className="permissions-page">
      <h1 className="permissions-title">Module Permissions</h1>
      <p className="permissions-subtitle">Configure module access for different roles.</p>

      <div className="permissions-info-box">
        <span className="info-icon">Info</span>
        <div>
          <strong className="info-title">Note regarding Admin Access</strong>
          <p className="info-text">Administrators always have full read/write access to all modules.</p>
        </div>
      </div>

      <div className="permissions-card">
        <table className="permissions-table">
          <thead>
            <tr>
              <th className="th-field-name">Module</th>
              <th className="th-role">Manager</th>
              <th className="th-role">Staff</th>
            </tr>
          </thead>

          <tbody>
            {modules.map((module, index) => {
              const isLastRows = index >= modules.length - 3;

              return (
                <tr key={module.key} className="permissions-row">
                  <td className="field-name-cell">{module.label}</td>
                  <td className="permission-cell">
                    <Dropdown
                      value={localPermissions.Manager[module.key]}
                      open={open === `m-${index}`}
                      onToggle={() => setOpen(open === `m-${index}` ? null : `m-${index}`)}
                      onSelect={(value) => updatePermission("Manager", module.key, value)}
                      dropUp={isLastRows}
                    />
                  </td>
                  <td className="permission-cell">
                    <Dropdown
                      value={localPermissions.Staff[module.key]}
                      open={open === `s-${index}`}
                      onToggle={() => setOpen(open === `s-${index}` ? null : `s-${index}`)}
                      onSelect={(value) => updatePermission("Staff", module.key, value)}
                      dropUp={isLastRows}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Dropdown({ value, open, onToggle, onSelect, dropUp }) {
  const current = PERMISSION_OPTIONS.find((option) => option.value === value) || PERMISSION_OPTIONS[0];

  return (
    <div className={`perms-dropdown-wrapper ${dropUp ? "drop-up" : "drop-down"}`}>
      <button className="perms-dropdown-btn" onClick={onToggle}>
        <span className="perms-dropdown-content">
          <span className={`perms-status-dot ${current.color}`} />
          {current.label}
        </span>
        <span className="perms-arrow">v</span>
      </button>

      {open ? (
        <div className="perms-dropdown-menu">
          {PERMISSION_OPTIONS.map((option) => (
            <div
              key={option.value}
              className={`perms-dropdown-item ${option.value === value ? "active" : ""}`}
              onClick={() => onSelect(option.value)}
            >
              <span className={`perms-status-dot ${option.color}`} />
              <span className="perms-dropdown-label">{option.label}</span>
              {option.value === value ? <span className="perms-check">OK</span> : null}
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}
