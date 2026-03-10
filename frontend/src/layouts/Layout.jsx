import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";

const SIDEBAR_WIDTH = 320;

const Layout = ({ currentUser, onLogout, isLoading, error, currentPermissions }) => {
  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          height: "100vh",
          width: SIDEBAR_WIDTH,
          zIndex: 100,
        }}
      >
        <Sidebar currentUser={currentUser} onLogout={onLogout} currentPermissions={currentPermissions} />
      </div>

      <main
        style={{
          marginLeft: SIDEBAR_WIDTH,
          flex: 1,
          padding: "24px",
          background: "#f7f9fc",
          minHeight: "100vh",
          overflowY: "auto",
        }}
      >
        {isLoading ? <p>Loading CRM data...</p> : null}
        {!isLoading && error ? <p style={{ color: "#dc2626" }}>{error}</p> : null}
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
