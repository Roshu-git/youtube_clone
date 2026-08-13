import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const API_URL = "http://localhost:5000/api";

function CreateVideo() {
  const { user, token } = useAuth();
  const navigate = useNavigate();

  const [channels, setChannels] = useState([]);
  const [loadingChannels, setLoadingChannels] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    title: "",
    description: "",
    videoUrl: "",
    thumbnailUrl: "",
    category: "React",
    channelId: "",
  });

  // ==========================================
  // GET USER CHANNEL
  // ==========================================

  useEffect(() => {
    const fetchChannels = async () => {
      try {
        setLoadingChannels(true);

        /*
          If your user already contains channelId,
          this will work immediately.
        */
        if (user?.channelId) {
          setForm((prev) => ({
            ...prev,
            channelId: user.channelId,
          }));

          setChannels([
            {
              _id: user.channelId,
              channelName:
                user.channelName ||
                `${user.username}'s Channel`,
            },
          ]);

          return;
        }

        /*
          If you don't have user.channelId yet,
          use your backend /my-channel endpoint
          after adding it.
        */
        const response = await axios.get(
          `${API_URL}/channels/my-channel`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const channel =
          response.data.channel ||
          response.data;

        setChannels([channel]);

        setForm((prev) => ({
          ...prev,
          channelId: channel._id,
        }));
      } catch (error) {
        console.error(
          "GET CHANNEL ERROR:",
          error
        );

        alert(
          error.response?.data?.message ||
          "Unable to find your channel"
        );
      } finally {
        setLoadingChannels(false);
      }
    };

    if (user && token) {
      fetchChannels();
    }
  }, [user, token]);

  // ==========================================
  // HANDLE CHANGE
  // ==========================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ==========================================
  // CREATE VIDEO
  // ==========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token) {
      alert("Please sign in first.");
      return;
    }

    if (
      !form.title.trim() ||
      !form.videoUrl.trim() ||
      !form.thumbnailUrl.trim() ||
      !form.category.trim() ||
      !form.channelId
    ) {
      alert(
        "Please fill all required fields."
      );
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
          channelId: form.channelId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
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

      alert(
        error.response?.data?.message ||
        "Unable to create video"
      );
    } finally {
      setSubmitting(false);
    }
  };

  // ==========================================
  // NOT LOGGED IN
  // ==========================================

  if (!user) {
    return (
      <div className="p-6">
        <h2>
          Please sign in to create a video.
        </h2>
      </div>
    );
  }

  // ==========================================
  // LOADING CHANNEL
  // ==========================================

  if (loadingChannels) {
    return (
      <div className="p-6">
        <h2>Loading channel...</h2>
      </div>
    );
  }

  // ==========================================
  // RENDER
  // ==========================================

  return (
    <div className="max-w-3xl mx-auto p-6">

      <h1 className="text-3xl font-bold mb-8">
        Create Video
      </h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl shadow-sm p-6 space-y-6"
      >

        {/* TITLE */}

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

        {/* DESCRIPTION */}

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

        {/* VIDEO URL */}

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
        </div>

        {/* THUMBNAIL URL */}

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
        </div>

        {/* CATEGORY */}

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

        {/* CHANNEL */}

        {channels.length > 0 && (
          <div>
            <label className="block font-medium mb-2">
              Channel
            </label>

            <select
              name="channelId"
              value={form.channelId}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-3"
            >
              {channels.map((channel) => (
                <option
                  key={channel._id}
                  value={channel._id}
                >
                  {channel.channelName}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* SUBMIT */}

        <button
          type="submit"
          disabled={submitting || !form.channelId}
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