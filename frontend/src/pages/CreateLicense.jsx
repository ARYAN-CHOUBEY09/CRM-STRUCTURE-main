import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaArrowLeft, FaCalendarAlt, FaSave } from "react-icons/fa";
import "../styles/CreateCustomer.css";

const CreateLicense = ({ onSave }) => {
  const navigate = useNavigate();
  const datePickerRef = useRef(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [expiryDate, setExpiryDate] = useState(null);
  const [formData, setFormData] = useState({
    product: "",
    licenseNumber: "",
    productKey: "",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setIsSubmitting(true);

    try {
      await onSave({
        ...formData,
        expiryDate: expiryDate ? expiryDate.toLocaleDateString("en-GB") : "N/A",
      });
      navigate("/app/licenses");
    } catch (error) {
      alert(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="create-customer-page">
      <div className="create-header">
        <button className="back-btn" onClick={() => navigate(-1)}>
          <FaArrowLeft />
        </button>
        <div>
          <h1>Create License</h1>
          <p>Add a new product license to the system.</p>
        </div>
      </div>

      <div className="card">
        <h2>License Details</h2>
        <p className="card-subtitle">Store product, key, and expiry details</p>
        <div className="form-grid">
          <div className="form-group">
            <label>Product</label>
            <input name="product" value={formData.product} onChange={handleChange} type="text" placeholder="Windows 11 Pro" />
          </div>
          <div className="form-group">
            <label>License Number</label>
            <input name="licenseNumber" value={formData.licenseNumber} onChange={handleChange} type="text" placeholder="LIC-1001" />
          </div>
          <div className="form-group">
            <label>Product Key</label>
            <input name="productKey" value={formData.productKey} onChange={handleChange} type="text" placeholder="XXXX-XXXX-XXXX-XXXX" />
          </div>
          <div className="form-group">
            <label>Expiry Date</label>
            <div className="input-icon">
              <DatePicker
                ref={datePickerRef}
                selected={expiryDate}
                onChange={(date) => setExpiryDate(date)}
                dateFormat="dd/MM/yyyy"
                className="date-input"
                showPopperArrow={false}
                placeholderText="Select expiry date"
              />
              <FaCalendarAlt className="calendar-icon" onClick={() => datePickerRef.current.setFocus()} />
            </div>
          </div>
        </div>
      </div>

      <div className="form-actions">
        <button className="btn outline" onClick={() => navigate(-1)}>
          Cancel
        </button>
        <button className="btn primary" onClick={handleSave}>
          <FaSave /> {isSubmitting ? "Creating..." : "Create License"}
        </button>
      </div>
    </div>
  );
};

export default CreateLicense;
