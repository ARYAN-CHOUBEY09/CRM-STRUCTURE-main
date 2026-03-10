import { useRef, useState } from "react";
import { FaFileUpload } from "react-icons/fa";
import "../styles/ImportData.css";

const parseCsv = (text) => {
  const rows = [];
  let current = "";
  let row = [];
  let inQuotes = false;

  for (let index = 0; index < text.length; index += 1) {
    const char = text[index];
    const nextChar = text[index + 1];

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        current += '"';
        index += 1;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === "," && !inQuotes) {
      row.push(current.trim());
      current = "";
    } else if ((char === "\n" || char === "\r") && !inQuotes) {
      if (char === "\r" && nextChar === "\n") {
        index += 1;
      }
      row.push(current.trim());
      current = "";
      if (row.some((cell) => cell.length > 0)) {
        rows.push(row);
      }
      row = [];
    } else {
      current += char;
    }
  }

  if (current.length > 0 || row.length > 0) {
    row.push(current.trim());
    if (row.some((cell) => cell.length > 0)) {
      rows.push(row);
    }
  }

  return rows;
};

const normalizeHeader = (value) => value.toLowerCase().replace(/[^a-z0-9]/g, "");

const toCustomerPayload = (headers, row) => {
  const record = Object.fromEntries(headers.map((header, index) => [header, row[index] || ""]));

  return {
    name: record.name || "",
    company: record.company || "",
    email: record.email || "",
    phone: record.phone || "",
    source: record.source || record.leadsource || "",
    status: record.status || "Lead",
    subscription: record.subscription || record.subscriptiontimeframe || record.product || "",
    expiration: record.expiration || record.subscriptiondate || "N/A",
    sale: record.sale || record.salesamount || "",
    payment: record.payment || record.paymentmode || "",
    notes: record.notes || record.internalnotes || "",
    assignedTo: "",
  };
};

const ImportData = ({ logs = [], onImportCustomers, canEdit }) => {
  const fileInputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewRows, setPreviewRows] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSelectFile = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      if (!file.name.toLowerCase().endsWith(".csv")) {
        alert("Unsupported file format. Please upload a CSV file to continue.");
        event.target.value = "";
        setSelectedFile(null);
        setPreviewRows([]);
        return;
      }

      const text = await file.text();
      const csvRows = parseCsv(text);

      if (csvRows.length < 2) {
        alert("The selected CSV file is empty or missing data rows. Please upload a valid customer file.");
        event.target.value = "";
        setSelectedFile(null);
        setPreviewRows([]);
        return;
      }

      const headers = csvRows[0].map(normalizeHeader);
      const rows = csvRows.slice(1).map((row) => toCustomerPayload(headers, row)).filter((row) => row.name);

      setSelectedFile(file);
      setPreviewRows(rows);
    }
  };

  const handleCreateImport = async () => {
    if (!selectedFile) {
      alert("No file selected. Please choose a CSV file before starting the import.");
      return;
    }

    if (previewRows.length === 0) {
      alert("No valid customer records were found in the selected file. Please verify the column headers and data format.");
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await onImportCustomers({
        fileName: selectedFile.name,
        rows: previewRows,
      });
      alert(`Import completed successfully.\nTotal records: ${result.totalRows}\nImported: ${result.successRows}\nFailed: ${result.failedRows}`);
      setSelectedFile(null);
      setPreviewRows([]);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      alert(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="import-page">
      <div className="import-header">
        <h1>Import Customers</h1>
        <p>Bulk upload customers from CSV or Excel files.</p>
      </div>

      <div className="import-card">
        <h2>Upload File</h2>
        <p className="subtitle">Supported formats: .xlsx, .xls, .csv</p>

        <div className="upload-box">
          <FaFileUpload className="upload-icon" />
          <button type="button" className="select-btn" onClick={handleSelectFile} disabled={!canEdit}>
            Select File
          </button>

          <input
            ref={fileInputRef}
            type="file"
            accept=".csv,.xls,.xlsx"
            hidden
            onChange={handleFileChange}
          />
        </div>

        {selectedFile ? <p style={{ marginTop: 16, color: "#0f172a" }}>Selected: {selectedFile.name}</p> : null}

        <button type="button" className="select-btn" onClick={handleCreateImport} style={{ marginTop: 18 }} disabled={!canEdit}>
          {isSubmitting ? "Importing..." : "Import Customers"}
        </button>

        <div className="supported-columns">
          <strong>Supported columns:</strong>
          <p>
            name, company, email, phone, source or leadSource, status,
            internalNotes or notes, salesAmount or sale, payment or paymentMode,
            subscription or subscriptionTimeframe, subscriptionDate or expiration
          </p>
        </div>

        <div className="supported-columns">
          <strong>Preview rows:</strong>
          <p>
            {previewRows.length === 0
              ? "No parsed rows yet."
              : previewRows.slice(0, 5).map((row) => `${row.name} (${row.company || "No company"})`).join(", ")}
          </p>
        </div>

        <div className="supported-columns">
          <strong>Recent imports:</strong>
          <p>
            {logs.length === 0
              ? "No imports logged yet."
              : logs.slice(0, 5).map((log) => `${log.fileName} (${log.status})`).join(", ")}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ImportData;
