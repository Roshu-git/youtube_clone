import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    setError("");
    setSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!formData.email || !formData.password) {
      setError("Email and password are required");
      return;
    }

    const result = await login(
      formData.email,
      formData.password
    );

    if (!result.success) {
      setError(result.message);
      return;
    }

    setSuccess("Login successful! Redirecting...");

    setTimeout(() => {
      navigate("/");
    }, 800);
  };

  return (
    <div className="signin-page">
      <div className="signin-card">

        <h1>Welcome, Sign-in here</h1>

        <p>
          Sign in to continue
        </p>

        <form onSubmit={handleSubmit}>

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />

          {error && (
            <p className="signin-error">
              {error}
            </p>
          )}

          {success && (
            <p className="signin-success">
              {success}
            </p>
          )}

          <button type="submit">
            Sign in
          </button>

        </form>

        <div className="signin-switch">
          Don't have an account?

          <Link to="/register">
            Create account
          </Link>
        </div>

      </div>
    </div>
  );
}

export default Login;