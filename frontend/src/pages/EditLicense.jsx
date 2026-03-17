import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import DatePicker from "react-datepicker";
import { FaArrowLeft, FaCalendarAlt } from "react-icons/fa";
import "../styles/CreateCustomer.css";

const EditLicense = ({ licenses, onSave }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const datePickerRef = useRef(null);
  const [formData, setFormData] = useState(null);
  const [expiryDate, setExpiryDate] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const licenseToEdit = licenses.find((license) => license.id === id);

    if (licenseToEdit) {
      setFormData(licenseToEdit);
      if (licenseToEdit.expiryDate && licenseToEdit.expiryDate !== "N/A") {
        const [day, month, year] = licenseToEdit.expiryDate.split("/");
        setExpiryDate(new Date(year, month - 1, day));
      }
    } else {
      navigate("/app/licenses");
    }
  }, [id, licenses, navigate]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async () => {
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

  if (!formData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="create-customer-page">
      <div className="create-header">
        <button className="back-btn" onClick={() => navigate(-1)}>
          <FaArrowLeft />
        </button>
        <div>
          <h1>Edit License</h1>
          <p>Managing details for {formData.product}</p>
        </div>
      </div>

      <div className="card">
        <h2>License Details</h2>
        <p className="card-subtitle">Update product, key, and expiry details</p>
        <div className="form-grid">
          <div className="form-group">
            <label>Product</label>
            <input name="product" value={formData.product} onChange={handleChange} type="text" />
          </div>
          <div className="form-group">
            <label>License Number</label>
            <input name="licenseNumber" value={formData.licenseNumber} onChange={handleChange} type="text" />
          </div>
          <div className="form-group">
            <label>Product Key</label>
            <input name="productKey" value={formData.productKey} onChange={handleChange} type="text" />
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
        <button className="btn primary" onClick={handleUpdate}>
          {isSubmitting ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
  );
};

export default EditLicense;
