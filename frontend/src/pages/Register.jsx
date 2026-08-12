import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: ""
  });

  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });

    setError("");
    setSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    // Username validation
    if (formData.username.trim().length < 3) {
      setError("Username must be at least 3 characters");
      return;
    }

    // Password validation
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    // Confirm password
    if (formData.password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:5000/api/auth/register",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json"
          },

          body: JSON.stringify({
            username: formData.username,
            email: formData.email,
            password: formData.password
          })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Registration failed");
        return;
      }

      setSuccess(
        "Registration successful! Redirecting to login..."
      );

      // Go to login page
      setTimeout(() => {
        navigate("/login");
      }, 1500);

    } catch (error) {
      console.error(error);

      setError("Unable to connect to server");
    }
  };

  return (
    <div className="signin-page">

      <div className="signin-card">

        <h1>Create your account</h1>

        <p>
          Register to continue to YouTube Clone
        </p>

        <form onSubmit={handleSubmit}>

          {/* Username */}

          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            required
          />

          {/* Email */}

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />

          {/* Password */}

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />

          {/* Confirm Password */}

          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
              setError("");
            }}
            required
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

          <button type="submit">
            Register
          </button>

        </form>

        <div className="signin-switch">
          Already have an account?

          <Link to="/login">
            Sign in
          </Link>
        </div>

      </div>

    </div>
  );
}

export default Register;