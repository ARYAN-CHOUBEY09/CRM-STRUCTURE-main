import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Login.css";

const Login = ({ onLogin, isAuthenticated }) => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "admin", password: "" });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/app/dashboard");
    }
  }, [isAuthenticated, navigate]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      await onLogin(form);
      navigate("/app/dashboard");
    } catch (loginError) {
      setError(loginError.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="login-container">
      <h1 className="brand-title">CRM</h1>
      <p className="brand-subtitle">Sign in to your enterprise account</p>

      <div className="login-card">
        <h2>Welcome Back</h2>
        <p className="card-subtitle">Enter your credentials to access the dashboard</p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Username</label>
            <input
              name="username"
              type="text"
              placeholder="admin"
              value={form.username}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              name="password"
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
            />
          </div>

          {error ? <p className="demo-text" style={{ color: "#dc2626", marginTop: 0 }}>{error}</p> : null}

          <button type="submit" className="signin-btn" disabled={isSubmitting}>
            {isSubmitting ? "Signing In..." : "Sign In"} <span>{"->"}</span>
          </button>
        </form>

        <p className="demo-text">Use your backend admin credentials to continue.</p>
      </div>
    </div>
  );
};

export default Login;
