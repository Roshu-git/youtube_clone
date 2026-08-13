import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const API_URL = "http://localhost:5000/api";

function CreateChannel({ isSidebarOpen}) {
  const { token } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    channelName: "",
    description: "",
    bannerUrl: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // =============================
  // HANDLE INPUT CHANGE
  // =============================
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =============================
  // CREATE CHANNEL
  // =============================
  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    // Check login
    if (!token) {
      setError("Please sign in first.");
      return;
    }

    // Check channel name
    if (!formData.channelName.trim()) {
      setError("Channel name is required.");
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post(
        `${API_URL}/channels`,
        {
          channelName: formData.channelName.trim(),
          description: formData.description.trim(),

          // IMPORTANT:
          // Backend expects "channelBanner"
          channelBanner: formData.bannerUrl.trim(),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("CHANNEL CREATED:", response.data);

      // Channel created successfully
      // Go to My Channel page
      navigate("/channel");

    } catch (error) {
      console.error("CREATE CHANNEL ERROR:", error);

      setError(
        error.response?.data?.message ||
          "Unable to create channel."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    // <div className="vc-create-channel >
    <div className={`vc-create-channel ${
        !isSidebarOpen ? "expanded" : ""
      }`}>

      <div className="vc-create-channel-container">

        {/* =============================
            PAGE TITLE
        ============================= */}
        <h1>Create Your Channel</h1>

        <p>
          Create a channel to start uploading videos.
        </p>

        {/* =============================
            ERROR MESSAGE
        ============================= */}
        {error && (
          <div className="vc-error">
            {error}
          </div>
        )}

        {/* =============================
            FORM
        ============================= */}
        <form onSubmit={handleSubmit}>

          {/* =============================
              CHANNEL NAME
          ============================= */}
          <div className="vc-form-group file-input-group">

            <label htmlFor="channelName">
              Channel Name
            </label>

            <input className="channel-input"
              id="channelName"
              name="channelName"
              type="text"
              placeholder="Enter channel name"
              value={formData.channelName}
              onChange={handleChange}
              required
              disabled={loading}
            />

          </div>

          {/* =============================
              DESCRIPTION
          ============================= */}
          <div className="vc-form-group file-input-group">

            <label htmlFor="description">
              Description
            </label>

            <textarea className="channel-input"
              id="description"
              name="description"
              placeholder="Tell viewers about your channel"
              value={formData.description}
              onChange={handleChange}
              rows="5"
              disabled={loading}
            />

          </div>

          {/* =============================
              BANNER URL
          ============================= */}
          <div className="vc-form-group file-input-group">

            <label htmlFor="bannerUrl">
              Banner URL
            </label>

            <input className="channel-input"
              id="bannerUrl"
              name="bannerUrl"
              type="url"
              placeholder="https://example.com/banner.jpg"
              value={formData.bannerUrl}
              onChange={handleChange}
              disabled={loading}
            />

          </div>

          {/* =============================
              BANNER PREVIEW
          ============================= */}
          {formData.bannerUrl && (
            <div className="vc-banner-preview">

              <img
                src={formData.bannerUrl}
                alt="Channel banner preview"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />

            </div>
          )}

          {/* =============================
              CREATE BUTTON
          ============================= */}
          <button
            type="submit"
            disabled={loading}
          >
            {loading
              ? "Creating Channel..."
              : "Create Channel"}
          </button>

        </form>

      </div>

    </div>
  );
}

export default CreateChannel;