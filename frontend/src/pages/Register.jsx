import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  // =========================
  // HANDLE INPUT CHANGE
  // =========================
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setError("");
    setSuccess("");
  };

  // =========================
  // HANDLE REGISTER
  // =========================
  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    // Username validation
    if (!formData.username.trim()) {
      setError("Username is required");
      return;
    }

    if (formData.username.trim().length < 3) {
      setError("Username must be at least 3 characters");
      return;
    }

    // Email validation
    if (!formData.email.trim()) {
      setError("Email is required");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(formData.email)) {
      setError("Please enter a valid email address");
      return;
    }

    // Password validation
    if (!formData.password) {
      setError("Password is required");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    // Confirm password validation
    if (!confirmPassword) {
      setError("Please confirm your password");
      return;
    }

    if (formData.password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      setLoading(true);

      const result = await register(
        formData.username.trim(),
        formData.email.trim().toLowerCase(),
        formData.password
      );

      if (!result.success) {
        setError(result.message || "Registration failed");
        return;
      }

      setSuccess(
        "Registration successful! Redirecting to login..."
      );

      // Redirect to login after successful registration
      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (error) {
      console.error("REGISTER PAGE ERROR:", error);

      setError("Unable to connect to server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signin-page">
      <div className="signin-card">

        <h1>Hello! Welcome</h1>

        <p>
          Please sign up to create your account.
        </p>

        <form onSubmit={handleSubmit}>

          {/* Username */}
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            autoComplete="username"
            disabled={loading}
          />

          {/* Email */}
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            autoComplete="email"
            disabled={loading}
          />

          {/* Password */}
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            autoComplete="new-password"
            disabled={loading}
          />

          {/* Confirm Password */}
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
              setError("");
              setSuccess("");
            }}
            autoComplete="new-password"
            disabled={loading}
          />

          {/* Error */}
          {error && (
            <p className="signin-error">
              {error}
            </p>
          )}

          {/* Success */}
          {success && (
            <p className="signin-success">
              {success}
            </p>
          )}

          {/* Register Button */}
          <button
            type="submit"
            disabled={loading}
          >
            {loading ? "Creating Account..." : "Register"}
          </button>

        </form>

        {/* Login Link */}
        <div className="signin-switch">
          Already have an account?{" "}

          <Link to="/login">
            Sign in
          </Link>
        </div>

      </div>
    </div>
  );
}

export default Register;