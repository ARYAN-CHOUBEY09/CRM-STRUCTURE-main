import { useLocation, useNavigate } from "react-router-dom";
import {
  FaCog,
  FaFileImport,
  FaShieldAlt,
  FaTachometerAlt,
  FaUserCircle,
  FaUserCog,
  FaUsers,
} from "react-icons/fa";
import "../styles/Sidebar.css";

const menuItems = [
  { label: "Dashboard", icon: <FaTachometerAlt />, path: "/app/dashboard", moduleKey: "dashboard" },
  { label: "Customers", icon: <FaUsers />, path: "/app/customers", moduleKey: "customers" },
  { label: "Import Data", icon: <FaFileImport />, path: "/app/import", moduleKey: "imports" },
  { label: "Permissions", icon: <FaShieldAlt />, path: "/app/permissions", moduleKey: "permissions" },
  { label: "User Management", icon: <FaUserCog />, path: "/app/users", moduleKey: "users" },
];

const canAccessModule = (modules, moduleKey) => {
  const value = modules?.[moduleKey] || "No Access";
  return value === "View" || value === "Edit";
};

const Sidebar = ({ currentUser, onLogout, currentPermissions }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const visibleItems =
    currentUser?.role === "Admin"
      ? menuItems
      : menuItems.filter((item) => canAccessModule(currentPermissions, item.moduleKey));

  return (
    <aside className="sidebar">
      <div>
        <div className="sidebar-header">
          <div className="logo">
            <h2>CRM</h2>
            <span>Enterprise Solution</span>
          </div>

          <button className="icon-button">
            <FaCog />
          </button>
        </div>

        <hr className="sidebar-divider" />

        <nav className="sidebar-nav">
          {visibleItems.map((item) => (
            <button
              key={item.label}
              className={`nav-item ${location.pathname === item.path ? "active" : ""}`}
              onClick={() => navigate(item.path)}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-text">{item.label}</span>
            </button>
          ))}
        </nav>
      </div>

      <div className="sidebar-footer">
        <div className="user-block">
          <span className="avatar">
            <FaUserCircle />
          </span>
          <div>
            <p className="user-name">{currentUser?.fullName || "System Admin"}</p>
            <span className="user-role">{currentUser?.role || "Admin"}</span>
          </div>
        </div>

        <button className="signout-btn" onClick={onLogout}>
          Sign Out
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
