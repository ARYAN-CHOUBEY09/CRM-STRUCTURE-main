import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import DatePicker from "react-datepicker";
import { FaArrowLeft, FaCalendarAlt } from "react-icons/fa";
import "../styles/CreateCustomer.css";

const EditCustomer = ({ customers, onSave, users = [] }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const datePickerRef = useRef(null);
  const [formData, setFormData] = useState(null);
  const [expiryDate, setExpiryDate] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const customerToEdit = customers.find((customer) => customer.id === id);

    if (customerToEdit) {
      setFormData(customerToEdit);
      if (customerToEdit.expiration && customerToEdit.expiration !== "N/A") {
        const [day, month, year] = customerToEdit.expiration.split("/");
        setExpiryDate(new Date(year, month - 1, day));
      }
    } else {
      navigate("/app/customers");
    }
  }, [customers, id, navigate]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async () => {
    setIsSubmitting(true);

    try {
      await onSave({
        ...formData,
        expiration: expiryDate ? expiryDate.toLocaleDateString("en-GB") : "N/A",
      });
      navigate("/app/customers");
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
          <h1>Edit Customer</h1>
          <p>Managing details for {formData.name}</p>
        </div>
      </div>

      <div className="card">
        <h2>Core Information</h2>
        <p className="card-subtitle">Primary contact details</p>
        <div className="form-grid">
          <div className="form-group"><label>Full Name</label><input name="name" value={formData.name} onChange={handleChange} /></div>
          <div className="form-group"><label>Company</label><input name="company" value={formData.company} onChange={handleChange} /></div>
          <div className="form-group"><label>Email Address</label><input name="email" value={formData.email} onChange={handleChange} /></div>
          <div className="form-group"><label>Phone Number</label><input name="phone" type="tel" value={formData.phone} onChange={handleChange} /></div>
          <div className="form-group"><label>Lead Source</label><input name="source" value={formData.source || ""} onChange={handleChange} /></div>
        </div>
      </div>

      <div className="two-column">
        <div className="card">
          <h2>Status & Assignment</h2>
          <div className="form-row modern-row">
            <div className="form-group modern-select">
              <label>Status</label>
              <select name="status" value={formData.status} onChange={handleChange}>
                <option value="Lead">Lead</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
                <option value="Refund & Recharge">Refund & Recharge</option>
              </select>
            </div>

            <div className="form-group modern-select">
              <label>Assigned Agent</label>
              <select name="assignedTo" value={formData.assignedTo || ""} onChange={handleChange}>
                <option value="">Select Agent</option>
                {users.map((user) => (
                  <option key={user.id || user._id} value={user.id || user._id}>
                    {user.fullName}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="card">
          <h2>Subscription & Payments</h2>
          <div className="form-group"><label>Subscription Plan</label><input name="subscription" value={formData.subscription} onChange={handleChange} /></div>
          <div className="form-row">
            <div className="form-group"><label>Sale Amount</label><input name="sale" value={formData.sale} onChange={handleChange} /></div>
            <div className="form-group"><label>Payment Mode</label><input name="payment" value={formData.payment} onChange={handleChange} /></div>
          </div>
          <div className="form-group">
            <label>Expiration Date</label>
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

      <div className="card">
        <h2>Internal Notes</h2>
        <textarea name="notes" value={formData.notes} onChange={handleChange} />
      </div>

      <div className="form-actions">
        <button className="btn outline" onClick={() => navigate(-1)}>Cancel</button>
        <button className="btn primary" onClick={handleUpdate}>{isSubmitting ? "Saving..." : "Save Changes"}</button>
      </div>
    </div>
  );
};

export default EditCustomer;
