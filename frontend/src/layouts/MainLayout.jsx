import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";

const MainLayout = () => {
  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar />

      {/* Page Content */}
      <main style={{ flex: 1, padding: "30px", background: "#f5f7fb" }}>
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;