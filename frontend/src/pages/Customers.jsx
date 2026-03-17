import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaCheck,
  FaChevronDown,
  FaEllipsisV,
  FaFileExport,
  FaFileImport,
  FaFilter,
  FaPencilAlt,
  FaPlus,
  FaSearch,
  FaTrashAlt,
} from "react-icons/fa";
import "../styles/Customers.css";

const Customers = ({ customers, onDelete, canEdit, canViewImports }) => {
  const [statusOpen, setStatusOpen] = useState(false);
  const [status, setStatus] = useState("All Statuses");
  const [searchQuery, setSearchQuery] = useState("");
  const filterRef = useRef(null);
  const navigate = useNavigate();

  const statuses = ["All Statuses", "Lead", "Active", "Inactive", "Refund & Recharge"];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setStatusOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredCustomers = customers.filter((customer) => {
    const matchesSearch =
      customer.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.company?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.email?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = status === "All Statuses" || customer.status === status;

    return matchesSearch && matchesStatus;
  });

  const handleExportCSV = () => {
    if (customers.length === 0) {
      alert("No data to export");
      return;
    }

    const headers = ["Name", "Company", "Status", "Subscription", "Expiration", "Sale", "Payment", "Email", "Phone", "Assigned"];
    const rows = customers.map((customer) => [
      `"${customer.name || ""}"`,
      `"${customer.company || ""}"`,
      `"${customer.status || ""}"`,
      `"${customer.subscription || ""}"`,
      `"${customer.expiration || ""}"`,
      `"${customer.sale || ""}"`,
      `"${customer.payment || ""}"`,
      `"${customer.email || ""}"`,
      `"${customer.phone || ""}"`,
      `"${customer.assigned || ""}"`,
    ]);

    const csvString = [headers.join(","), ...rows.map((row) => row.join(","))].join("\n");
    const blob = new Blob(["\uFEFF" + csvString], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "crm_customers.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="customers-page">
      <div className="customers-header">
        <div>
          <h1>Customers</h1>
          <p>Manage your relationships and leads.</p>
        </div>

        <div className="customers-actions">
          <button className="btn outline" onClick={handleExportCSV}>
            <FaFileExport /> Export CSV
          </button>

          {canViewImports ? (
            <button className="btn outline" onClick={() => navigate("/app/import")}>
              <FaFileImport /> Import
            </button>
          ) : null}

          {canEdit ? (
            <button className="btn primary" onClick={() => navigate("/app/customers/create")}>
              <FaPlus /> Add Customer
            </button>
          ) : null}
        </div>
      </div>

      <div className="customers-toolbar">
        <div className="search-box">
          <FaSearch />
          <input
            placeholder="Search by name, company, or email..."
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
          />
        </div>

        <div className="status-filter" ref={filterRef}>
          <button className="status-btn" onClick={() => setStatusOpen(!statusOpen)}>
            <FaFilter /> <span>{status}</span> <FaChevronDown />
          </button>
          {statusOpen ? (
            <div className="status-dropdown">
              {statuses.map((entry) => (
                <div
                  key={entry}
                  className={`status-item ${status === entry ? "active" : ""}`}
                  onClick={() => {
                    setStatus(entry);
                    setStatusOpen(false);
                  }}
                >
                  <span className="tick">{status === entry ? <FaCheck /> : null}</span>
                  <span>{entry}</span>
                </div>
              ))}
            </div>
          ) : null}
        </div>
      </div>

      <div className="customers-table">
        <div className="table-header">
          <div className="table-row header-row">
            <span>Name & Company</span>
            <span>Status</span>
            <span>Subscription</span>
            <span>Expiration</span>
            <span>Sale & Payment</span>
            <span>Contact</span>
            <span>Assigned</span>
            <span>Action</span>
          </div>
        </div>

        <div className="table-body">
          {filteredCustomers.length === 0 ? (
            <div className="table-empty">No customers found.</div>
          ) : (
            filteredCustomers.map((customer) => (
              <CustomerRow key={customer.id} customer={customer} onDelete={onDelete} canEdit={canEdit} />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

const CustomerRow = ({ customer, onDelete, canEdit }) => {
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
    <div className="table-row">
      <div className="col-stack">
        <span className="card-label">Name</span>
        <span className="row-name">{customer.name}</span>
        <span className="row-subtext">{customer.company}</span>
      </div>
      <div>
        <span className="card-label">Status</span>
        <span className={`status-badge ${customer.status?.toLowerCase() === "active" ? "active" : "other"}`}>
          {customer.status || "Unknown"}
        </span>
      </div>
      <div>
        <span className="card-label">Subscription</span>
        <span className="row-bold">{customer.subscription || "—"}</span>
      </div>
      <div>
        <span className="card-label">Expiration</span>
        <span className="row-subtext">{customer.expiration || "—"}</span>
      </div>
      <div className="col-stack">
        <span className="card-label">Sale</span>
        <span className="row-bold">{customer.sale ? `$${customer.sale}` : "—"}</span>
        <span className="row-subtext">{customer.payment || "—"}</span>
      </div>
      <div className="col-stack">
        <span className="card-label">Contact</span>
        <span className="row-email">{customer.email || "—"}</span>
        <span className="row-subtext">{customer.phone || "—"}</span>
      </div>
      <div>
        <span className="card-label">Assigned</span>
        <span className="row-subtext">{customer.assigned || "—"}</span>
      </div>

      {canEdit ? (
        <div className="row-actions" ref={menuRef}>
          <button className="dots-btn" onClick={() => setMenuOpen(!menuOpen)}>
            <FaEllipsisV />
          </button>
          {menuOpen ? (
            <div className="action-menu">
              <div className="action-opt" onClick={() => navigate(`/app/customers/edit/${customer.id}`)}>
                <FaPencilAlt /> Edit
              </div>
              <div className="action-opt delete" onClick={() => onDelete(customer.id).catch((error) => alert(error.message))}>
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

export default Customers;
