import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const API_URL = "http://localhost:5000/api";

function CreateVideo() {
  const { user, token } = useAuth();
  const navigate = useNavigate();

  const [channel, setChannel] = useState(null);
  const [loadingChannel, setLoadingChannel] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    title: "",
    description: "",
    videoUrl: "",
    thumbnailUrl: "",
    category: "React",
    channelId: "",
  });

  // =====================================================
  // GET MY CHANNEL
  // GET /api/channels/my
  // =====================================================

  useEffect(() => {
    const fetchMyChannel = async () => {
      if (!token) {
        setLoadingChannel(false);
        return;
      }

      try {
        setLoadingChannel(true);

        const response = await axios.get(
          `${API_URL}/channels/my`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        console.log("MY CHANNEL RESPONSE:", response.data);

        const myChannel = response.data.channel;

        if (!myChannel) {
          setChannel(null);
          setForm((prev) => ({
            ...prev,
            channelId: "",
          }));

          return;
        }

        setChannel(myChannel);

        setForm((prev) => ({
          ...prev,
          channelId: myChannel._id,
        }));

      } catch (error) {
        console.error(
          "GET MY CHANNEL ERROR:",
          error
        );

        setChannel(null);

        alert(
          error.response?.data?.message ||
          "Unable to find your channel"
        );
      } finally {
        setLoadingChannel(false);
      }
    };

    fetchMyChannel();
  }, [token]);

  // =====================================================
  // HANDLE INPUT CHANGE
  // =====================================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =====================================================
  // CREATE VIDEO
  // POST /api/videos
  // =====================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token) {
      alert("Please sign in first.");
      return;
    }

    if (!channel?._id) {
      alert("Please create a channel first.");
      return;
    }

    if (!form.title.trim()) {
      alert("Please enter video title.");
      return;
    }

    if (!form.videoUrl.trim()) {
      alert("Please enter video URL.");
      return;
    }

    if (!form.thumbnailUrl.trim()) {
      alert("Please enter thumbnail URL.");
      return;
    }

    if (!form.category.trim()) {
      alert("Please select a category.");
      return;
    }

    try {
      setSubmitting(true);

      const response = await axios.post(
        `${API_URL}/videos`,
        {
          title: form.title.trim(),
          description: form.description.trim(),
          videoUrl: form.videoUrl.trim(),
          thumbnailUrl: form.thumbnailUrl.trim(),
          category: form.category.trim(),
          channelId: channel._id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log(
        "VIDEO CREATED:",
        response.data
      );

      alert("Video created successfully!");

      // Go to channel page
      navigate("/channel");

    } catch (error) {
      console.error(
        "CREATE VIDEO ERROR:",
        error
      );

      console.error(
        "SERVER RESPONSE:",
        error.response?.data
      );

      alert(
        error.response?.data?.message ||
        "Unable to create video"
      );

    } finally {
      setSubmitting(false);
    }
  };

  // =====================================================
  // NOT LOGGED IN
  // =====================================================

  if (!user || !token) {
    return (
      <div className="p-6">
        <h2>
          Please sign in to create a video.
        </h2>
      </div>
    );
  }

  // =====================================================
  // LOADING
  // =====================================================

  if (loadingChannel) {
    return (
      <div className="p-6">
        <h2>Loading your channel...</h2>
      </div>
    );
  }

  // =====================================================
  // NO CHANNEL
  // =====================================================

  if (!channel) {
    return (
      <div className="max-w-2xl mx-auto p-6">

        <div className="bg-white rounded-2xl shadow-sm p-8 text-center">

          <h2 className="text-2xl font-bold mb-3">
            Create a channel first
          </h2>

          <p className="text-gray-600 mb-6">
            You need to create a channel before
            you can upload videos.
          </p>

          <button
            onClick={() => navigate("/create-channel")}
            className="bg-black text-white px-6 py-3 rounded-full hover:bg-gray-800"
          >
            Create Channel
          </button>

        </div>

      </div>
    );
  }

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <div className="max-w-3xl mx-auto p-6">

      <h1 className="text-3xl font-bold mb-8">
        Create Video
      </h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl shadow-sm p-6 space-y-6"
      >

        {/* ================================================= */}
        {/* CHANNEL */}
        {/* ================================================= */}

        <div className="border rounded-xl p-4 bg-gray-50">

          <p className="text-sm text-gray-500 mb-1">
            Publishing to
          </p>

          <h2 className="font-semibold text-lg">
            {channel.channelName}
          </h2>

        </div>

        {/* ================================================= */}
        {/* TITLE */}
        {/* ================================================= */}

        <div>

          <label className="block font-medium mb-2">
            Title
          </label>

          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="Enter video title"
            className="w-full border rounded-lg px-4 py-3"
            required
          />

        </div>

        {/* ================================================= */}
        {/* DESCRIPTION */}
        {/* ================================================= */}

        <div>

          <label className="block font-medium mb-2">
            Description
          </label>

          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Enter video description"
            rows={5}
            className="w-full border rounded-lg px-4 py-3"
          />

        </div>

        {/* ================================================= */}
        {/* VIDEO URL */}
        {/* ================================================= */}

        <div>

          <label className="block font-medium mb-2">
            Video URL
          </label>

          <input
            type="url"
            name="videoUrl"
            value={form.videoUrl}
            onChange={handleChange}
            placeholder="https://example.com/video.mp4"
            className="w-full border rounded-lg px-4 py-3"
            required
          />

          <p className="text-sm text-gray-500 mt-1">
            Use a direct .mp4 video URL.
          </p>

        </div>

        {/* ================================================= */}
        {/* THUMBNAIL URL */}
        {/* ================================================= */}

        <div>

          <label className="block font-medium mb-2">
            Thumbnail URL
          </label>

          <input
            type="url"
            name="thumbnailUrl"
            value={form.thumbnailUrl}
            onChange={handleChange}
            placeholder="https://example.com/thumbnail.jpg"
            className="w-full border rounded-lg px-4 py-3"
            required
          />

          <p className="text-sm text-gray-500 mt-1">
            Use a direct image URL such as .jpg, .jpeg or .png.
          </p>

        </div>

        {/* ================================================= */}
        {/* CATEGORY */}
        {/* ================================================= */}

        <div>

          <label className="block font-medium mb-2">
            Category
          </label>

          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            className="w-full border rounded-lg px-4 py-3"
          >

            <option value="React">
              React
            </option>

            <option value="JavaScript">
              JavaScript
            </option>

            <option value="MERN">
              MERN
            </option>

            <option value="CSS">
              CSS
            </option>

            <option value="Node.js">
              Node.js
            </option>

            <option value="Frontend">
              Frontend
            </option>

            <option value="Gaming">
              Gaming
            </option>

            <option value="Education">
              Education
            </option>

          </select>

        </div>

        {/* ================================================= */}
        {/* SUBMIT */}
        {/* ================================================= */}

        <button
          type="submit"
          disabled={submitting || !channel?._id}
          className="bg-black text-white px-6 py-3 rounded-full hover:bg-gray-800 disabled:opacity-50"
        >

          {submitting
            ? "Creating..."
            : "Create Video"}

        </button>

      </form>

    </div>
  );
}

export default CreateVideo;