import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEllipsisV, FaFileExport, FaPencilAlt, FaPlus, FaSearch, FaTrashAlt } from "react-icons/fa";
import "../styles/Customers.css";

const Licenses = ({ licenses, onDelete, canEdit }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const filteredLicenses = licenses.filter((license) => {
    const query = searchQuery.toLowerCase();

    return (
      license.product?.toLowerCase().includes(query) ||
      license.licenseNumber?.toLowerCase().includes(query) ||
      license.productKey?.toLowerCase().includes(query)
    );
  });

  const handleExportCSV = () => {
    if (licenses.length === 0) {
      alert("No data to export");
      return;
    }

    const headers = ["Product", "License Number", "Product Key", "Expiry Date"];
    const rows = licenses.map((license) => [
      `"${license.product || ""}"`,
      `"${license.licenseNumber || ""}"`,
      `"${license.productKey || ""}"`,
      `"${license.expiryDate || ""}"`,
    ]);

    const csvString = [headers.join(","), ...rows.map((row) => row.join(","))].join("\n");
    const blob = new Blob(["\uFEFF" + csvString], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "crm_licenses.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="customers-page">
      <div className="customers-header">
        <div>
          <h1>Licenses</h1>
          <p>Manage your product license records and expiry dates.</p>
        </div>

        <div className="customers-actions">
          <button className="btn secondary" onClick={handleExportCSV}>
            <FaFileExport /> Export CSV
          </button>

          {canEdit ? (
            <button className="btn primary" onClick={() => navigate("/app/licenses/create")}>
              <FaPlus /> Add License
            </button>
          ) : null}
        </div>
      </div>

      <div className="customers-toolbar">
        <div className="search-box">
          <FaSearch />
          <input
            placeholder="Search by product, license number, or key..."
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
          />
        </div>
      </div>

      <div className="customers-table">
        <div className="table-header">
          <div className="table-row header-row licenses-grid">
            <span>Product</span>
            <span>License Number</span>
            <span>Product Key</span>
            <span>Expiry Date</span>
            <span>Action</span>
          </div>
        </div>

        <div className="table-body">
          {filteredLicenses.length === 0 ? (
            <div className="table-empty">No licenses found.</div>
          ) : (
            filteredLicenses.map((license) => <LicenseRow key={license.id} license={license} onDelete={onDelete} canEdit={canEdit} />)
          )}
        </div>
      </div>
    </div>
  );
};

const LicenseRow = ({ license, onDelete, canEdit }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const closeMenu = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", closeMenu);
    return () => document.removeEventListener("mousedown", closeMenu);
  }, []);

  return (
    <div className="table-row licenses-grid">
      <div className="col-stack">
        <span className="card-label">Product</span>
        <span className="row-name">{license.product || "-"}</span>
      </div>
      <div>
        <span className="card-label">License Number</span>
        <span className="row-subtext">{license.licenseNumber || "-"}</span>
      </div>
      <div className="col-stack">
        <span className="card-label">Product Key</span>
        <span className="row-subtext">{license.productKey || "-"}</span>
      </div>
      <div>
        <span className="card-label">Expiry Date</span>
        <span className="row-subtext">{license.expiryDate || "N/A"}</span>
      </div>

      {canEdit ? (
        <div className="row-actions" ref={menuRef}>
          <button className="dots-btn" onClick={() => setMenuOpen(!menuOpen)}>
            <FaEllipsisV />
          </button>
          {menuOpen ? (
            <div className="action-menu">
              <div className="action-opt" onClick={() => navigate(`/app/licenses/edit/${license.id}`)}>
                <FaPencilAlt /> Edit
              </div>
              <div className="action-opt delete" onClick={() => onDelete(license.id).catch((error) => alert(error.message))}>
                <FaTrashAlt /> Delete
              </div>
            </div>
          ) : null}
        </div>
      ) : (
        <div />
      )}
    </div>
  );
};

export default Licenses;
