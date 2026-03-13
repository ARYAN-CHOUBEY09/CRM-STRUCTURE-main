import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { FaBars } from "react-icons/fa";
import Sidebar from "../components/Sidebar";
import "../styles/Layout.css";

const SIDEBAR_WIDTH = 320;
const MOBILE_BREAKPOINT = 900;

const Layout = ({ currentUser, onLogout, isLoading, error, currentPermissions }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileViewport, setIsMobileViewport] = useState(() => window.innerWidth <= MOBILE_BREAKPOINT);

  useEffect(() => {
    const handleResize = () => {
      const isMobile = window.innerWidth <= MOBILE_BREAKPOINT;
      setIsMobileViewport(isMobile);

      if (!isMobile) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="layout-shell">
      {isMobileViewport && isMobileMenuOpen ? (
        <button className="layout-overlay" type="button" aria-label="Close menu" onClick={() => setIsMobileMenuOpen(false)} />
      ) : null}

      <div
        className="layout-sidebar"
        style={{
          width: SIDEBAR_WIDTH,
        }}
      >
        <Sidebar
          currentUser={currentUser}
          onLogout={onLogout}
          currentPermissions={currentPermissions}
          isMobileOpen={isMobileMenuOpen}
          onClose={() => setIsMobileMenuOpen(false)}
          onNavigateItem={() => setIsMobileMenuOpen(false)}
        />
      </div>

      <main className="layout-main" style={{ "--sidebar-width": `${SIDEBAR_WIDTH}px` }}>
        {isMobileViewport ? (
          <div className="mobile-topbar">
            <button className="mobile-menu-button" type="button" onClick={() => setIsMobileMenuOpen(true)}>
              <FaBars />
            </button>
            <span className="mobile-topbar-title">CRM</span>
          </div>
        ) : null}
        {isLoading ? <p>Loading CRM data...</p> : null}
        {!isLoading && error ? <p style={{ color: "#dc2626" }}>{error}</p> : null}
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
