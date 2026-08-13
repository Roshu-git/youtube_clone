import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const API_URL = "http://localhost:5000/api";

function Channel({ isSidebarOpen }) {
  const { user, token } = useAuth();
  const navigate = useNavigate();

  // ==========================================
  // STATE
  // ==========================================

  const [channel, setChannel] = useState(null);
  const [videos, setVideos] = useState([]);

  const [activeTab, setActiveTab] = useState("Home");

  const [loading, setLoading] = useState(true);
  const [videosLoading, setVideosLoading] = useState(false);

  const [error, setError] = useState("");
  const [noChannel, setNoChannel] = useState(false);

  const [editingId, setEditingId] = useState(null);

  const [videoForm, setVideoForm] = useState({
    title: "",
    description: "",
    videoUrl: "",
    thumbnailUrl: "",
    category: "React",
  });

  const [saving, setSaving] = useState(false);

  // ==========================================
  // RESET VIDEO FORM
  // ==========================================

  const resetVideoForm = () => {
    setVideoForm({
      title: "",
      description: "",
      videoUrl: "",
      thumbnailUrl: "",
      category: "React",
    });

    setEditingId(null);
  };

  // ==========================================
  // GET MY CHANNEL
  // ==========================================

  const fetchChannel = async () => {
    if (!token) {
      setLoading(false);
      setError("Please sign in.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setNoChannel(false);

      const response = await axios.get(
        `${API_URL}/channels/my`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const myChannel = response.data.channel;

      if (!myChannel) {
        setNoChannel(true);
        setChannel(null);
        return;
      }

      setChannel(myChannel);

      // Get videos belonging to this channel
      await fetchVideos(myChannel._id);

    } catch (error) {
      // ========================================
      // NO CHANNEL CREATED
      // ========================================

      if (error.response?.status === 404) {
        setNoChannel(true);
        setChannel(null);
        setVideos([]);
        setError("");

        return;
      }

      // ========================================
      // OTHER API ERROR
      // ========================================

      console.error("GET CHANNEL ERROR:", error);

      setError(
        error.response?.data?.message ||
          "Unable to load channel"
      );

    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // GET CHANNEL VIDEOS
  // ==========================================

  const fetchVideos = async (channelId) => {
    try {
      setVideosLoading(true);

      const response = await axios.get(
        `${API_URL}/videos?channelId=${channelId}`
      );

      setVideos(response.data.videos || []);

    } catch (error) {
      console.error(
        "GET CHANNEL VIDEOS ERROR:",
        error
      );

      setVideos([]);

    } finally {
      setVideosLoading(false);
    }
  };

  // ==========================================
  // LOAD CHANNEL
  // ==========================================

  useEffect(() => {
    if (!user || !token) {
      setLoading(false);
      return;
    }

    fetchChannel();
  }, [user, token]);

  // ==========================================
  // FORM CHANGE
  // ==========================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setVideoForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ==========================================
  // CREATE / UPDATE VIDEO
  // ==========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token) {
      alert("Please sign in.");
      return;
    }

    if (!channel?._id) {
      alert("Channel not found.");
      return;
    }

    if (
      !videoForm.title.trim() ||
      !videoForm.videoUrl.trim() ||
      !videoForm.thumbnailUrl.trim() ||
      !videoForm.category.trim()
    ) {
      alert(
        "Title, video URL, thumbnail URL and category are required."
      );

      return;
    }

    try {
      setSaving(true);

      // ========================================
      // UPDATE EXISTING VIDEO
      // ========================================

      if (editingId) {
        const response = await axios.put(
          `${API_URL}/videos/${editingId}`,
          {
            title: videoForm.title.trim(),
            description: videoForm.description.trim(),
            videoUrl: videoForm.videoUrl.trim(),
            thumbnailUrl: videoForm.thumbnailUrl.trim(),
            category: videoForm.category.trim(),
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const updatedVideo = response.data.video;

        setVideos((prev) =>
          prev.map((video) =>
            video._id === editingId
              ? updatedVideo
              : video
          )
        );

        alert("Video updated successfully.");
      }

      // ========================================
      // CREATE NEW VIDEO
      // ========================================

      else {
        const response = await axios.post(
          `${API_URL}/videos`,
          {
            title: videoForm.title.trim(),
            description: videoForm.description.trim(),
            videoUrl: videoForm.videoUrl.trim(),
            thumbnailUrl: videoForm.thumbnailUrl.trim(),
            category: videoForm.category.trim(),
            channelId: channel._id,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const createdVideo = response.data.video;

        setVideos((prev) => [
          createdVideo,
          ...prev,
        ]);

        alert("Video uploaded successfully.");
      }

      resetVideoForm();

      setActiveTab("Videos");

    } catch (error) {
      console.error(
        "CREATE/UPDATE VIDEO ERROR:",
        error
      );

      alert(
        error.response?.data?.message ||
          "Unable to save video"
      );

    } finally {
      setSaving(false);
    }
  };

  // ==========================================
  // EDIT VIDEO
  // ==========================================

  const handleEdit = (video) => {
    setVideoForm({
      title: video.title || "",
      description: video.description || "",
      videoUrl: video.videoUrl || "",
      thumbnailUrl: video.thumbnailUrl || "",
      category: video.category || "React",
    });

    setEditingId(video._id);

    setActiveTab("Videos");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // ==========================================
  // DELETE VIDEO
  // ==========================================

  const handleDelete = async (videoId) => {
    if (!token) {
      alert("Please sign in.");
      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to delete this video?"
    );

    if (!confirmed) {
      return;
    }

    try {
      await axios.delete(
        `${API_URL}/videos/${videoId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setVideos((prev) =>
        prev.filter(
          (video) => video._id !== videoId
        )
      );

      if (editingId === videoId) {
        resetVideoForm();
      }

      alert("Video deleted successfully.");

    } catch (error) {
      console.error(
        "DELETE VIDEO ERROR:",
        error
      );

      alert(
        error.response?.data?.message ||
          "Unable to delete video"
      );
    }
  };

  // ==========================================
  // CANCEL EDIT
  // ==========================================

  const handleCancelEdit = () => {
    resetVideoForm();
  };

  // ==========================================
  // NOT LOGGED IN
  // ==========================================

  if (!user) {
    return (
      <div className="vc-channel-login-required p-6">
        <h2 className="text-xl font-semibold mb-3">
          Sign in to view your channel
        </h2>

        <button
          type="button"
          onClick={() => navigate("/login")}
          className="bg-black text-white px-5 py-2 rounded-full"
        >
          Sign In
        </button>
      </div>
    );
  }

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="channel-page p-6">
        <h2 className="text-xl font-semibold">
          Loading channel...
        </h2>
      </div>
    );
  }

  // ==========================================
  // NO CHANNEL
  // ==========================================

  if (noChannel) {
    return (
      <div
        className={`channel-page ${
          !isSidebarOpen ? "expanded" : ""
        }`}
      >
        <div className="min-h-[70vh] flex items-center justify-center p-6">
          <div className="bg-white rounded-2xl shadow-sm p-10 text-center max-w-lg w-full">

            <div className="text-6xl mb-6">
              📺
            </div>

            <h1 className="text-3xl font-bold mb-4">
              Create Your Channel
            </h1>

            <p className="text-gray-500 mb-8">
              You don't have a channel yet. Create your
              channel to start uploading videos and
              sharing your content.
            </p>

            <button
              type="button"
              onClick={() =>
                navigate("/create-channel")
              }
              className="bg-black text-white px-7 py-3 rounded-full font-medium hover:bg-gray-800 transition"
            >
              Create Channel
            </button>

          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // OTHER ERROR
  // ==========================================

  if (error) {
    return (
      <div className="channel-page p-6">
        <div className="max-w-xl mx-auto text-center mt-10">

          <h2 className="text-xl font-semibold mb-4">
            {error}
          </h2>

          <button
            type="button"
            onClick={fetchChannel}
            className="bg-black text-white px-5 py-2 rounded-full"
          >
            Try Again
          </button>

        </div>
      </div>
    );
  }

  // ==========================================
  // CHANNEL PAGE
  // ==========================================

  return (
    <div
      className={`channel-page ${
        !isSidebarOpen ? "expanded" : ""
      }`}
    >

      {/* ====================================== */}
      {/* CHANNEL BANNER */}
      {/* ====================================== */}

      <div className="channel-banner">
        <img
          src={
            channel.channelBanner ||
            "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1200"
          }
          alt="Channel banner"
          className="w-full h-64 object-cover"
        />
      </div>

      {/* ====================================== */}
      {/* CHANNEL INFO */}
      {/* ====================================== */}

      <div className="channel-info flex gap-4 items-center p-6">

        {/* AVATAR */}

        <div className="channel-avatar w-20 h-20 rounded-full bg-black text-white flex items-center justify-center text-3xl font-bold">

          {channel.channelName
            ?.charAt(0)
            .toUpperCase()}

        </div>

        {/* DETAILS */}

        <div className="channel-details">

          <h1 className="text-3xl font-bold">
            {channel.channelName}
          </h1>

          <p className="text-gray-600">
            @{user.username}
          </p>

          <p className="text-gray-500 text-sm">
            {channel.subscribers || 0} subscribers
            {" · "}
            {videos.length} videos
          </p>

          <p className="mt-2 text-gray-700">
            {channel.description ||
              "No channel description."}
          </p>

        </div>
      </div>

      {/* ====================================== */}
      {/* TABS */}
      {/* ====================================== */}

      <div className="channel-tabs flex gap-6 px-6 border-b overflow-x-auto">

        {[
          "Home",
          "Videos",
          "Shorts",
          "Live",
          "Playlists",
          "Community",
        ].map((tab) => (

          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={
              activeTab === tab
                ? "channel-tab active pb-3 border-b-2 border-black font-semibold whitespace-nowrap"
                : "channel-tab pb-3 text-gray-500 whitespace-nowrap"
            }
          >
            {tab}
          </button>

        ))}

      </div>

      {/* ====================================== */}
      {/* HOME TAB */}
      {/* ====================================== */}

      {activeTab === "Home" && (
        <div className="channel-home p-6">

          <h2 className="text-2xl font-bold mb-6">
            Latest Videos
          </h2>

          {videosLoading ? (

            <div className="text-center py-16 text-gray-500">
              <p>Loading videos...</p>
            </div>

          ) : videos.length === 0 ? (

            <div className="text-center py-16 text-gray-500">

              <p>
                No videos uploaded yet.
              </p>

              <button
                type="button"
                onClick={() =>
                  setActiveTab("Videos")
                }
                className="mt-4 bg-black text-white px-6 py-3 rounded-full"
              >
                Upload Your First Video
              </button>

            </div>

          ) : (

            <div className="channel-video-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">

              {videos.slice(0, 4).map((video) => (

                <div
                  key={video._id}
                  className="channel-video-card bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition"
                >

                  <img
                    src={video.thumbnailUrl}
                    alt={video.title}
                    className="w-full aspect-video object-cover"
                  />

                  <div className="channel-video-content p-4">

                    <h3 className="font-semibold line-clamp-2 mb-2">
                      {video.title}
                    </h3>

                    <p className="text-sm text-gray-500">
                      {video.category}
                    </p>

                    <p className="text-sm text-gray-500">
                      {video.views || 0} views
                    </p>

                  </div>
                </div>

              ))}

            </div>
          )}

        </div>
      )}

      {/* ====================================== */}
      {/* VIDEOS TAB */}
      {/* ====================================== */}

      {activeTab === "Videos" && (

        <div className="p-6 space-y-10">

          {/* CREATE / EDIT VIDEO FORM */}

          <div className="channel-form-section bg-white rounded-2xl p-6 shadow-sm">

            <h2 className="text-2xl font-bold mb-6">
              {editingId
                ? "Edit Video"
                : "Upload Video"}
            </h2>

            <form
              onSubmit={handleSubmit}
              className="channel-video-form space-y-5"
            >

              {/* TITLE */}

              <div>
                <label className="block mb-2 font-medium">
                  Video Title
                </label>

                <input
                  type="text"
                  name="title"
                  value={videoForm.title}
                  onChange={handleChange}
                  placeholder="Enter video title"
                  className="w-full border rounded-lg px-4 py-3"
                  required
                />
              </div>

              {/* DESCRIPTION */}

              <div>
                <label className="block mb-2 font-medium">
                  Description
                </label>

                <textarea
                  name="description"
                  value={videoForm.description}
                  onChange={handleChange}
                  placeholder="Enter video description"
                  rows={4}
                  className="w-full border rounded-lg px-4 py-3"
                />
              </div>

              {/* VIDEO URL */}

              <div>
                <label className="block mb-2 font-medium">
                  Video URL
                </label>

                <input
                  type="url"
                  name="videoUrl"
                  value={videoForm.videoUrl}
                  onChange={handleChange}
                  placeholder="https://example.com/video.mp4"
                  className="w-full border rounded-lg px-4 py-3"
                  required
                />
              </div>

              {/* THUMBNAIL URL */}

              <div>
                <label className="block mb-2 font-medium">
                  Thumbnail URL
                </label>

                <input
                  type="url"
                  name="thumbnailUrl"
                  value={videoForm.thumbnailUrl}
                  onChange={handleChange}
                  placeholder="https://example.com/thumbnail.jpg"
                  className="w-full border rounded-lg px-4 py-3"
                  required
                />
              </div>

              {/* CATEGORY */}

              <div>
                <label className="block mb-2 font-medium">
                  Category
                </label>

                <select
                  name="category"
                  value={videoForm.category}
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

                </select>
              </div>

              {/* BUTTONS */}

              <div className="flex gap-3">

                <button
                  type="submit"
                  disabled={saving}
                  className="bg-black text-white px-6 py-3 rounded-full hover:bg-gray-800 transition disabled:opacity-50"
                >
                  {saving
                    ? "Saving..."
                    : editingId
                    ? "Update Video"
                    : "Upload Video"}
                </button>

                {editingId && (

                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    disabled={saving}
                    className="px-6 py-3 rounded-full bg-gray-200 hover:bg-gray-300"
                  >
                    Cancel
                  </button>

                )}

              </div>

            </form>
          </div>

          {/* VIDEO LIST */}

          <div className="channel-videos-section">

            <h2 className="text-2xl font-bold mb-6">
              Your Videos ({videos.length})
            </h2>

            {videosLoading ? (

              <p>Loading videos...</p>

            ) : videos.length === 0 ? (

              <div className="text-center py-16 text-gray-500">
                <p>No videos uploaded yet.</p>
              </div>

            ) : (

              <div className="channel-video-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">

                {videos.map((video) => (

                  <div
                    key={video._id}
                    className="channel-video-card bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition"
                  >

                    {/* THUMBNAIL */}

                    <img
                      src={video.thumbnailUrl}
                      alt={video.title}
                      className="w-full aspect-video object-cover"
                    />

                    {/* CONTENT */}

                    <div className="channel-video-content p-4">

                      <h3 className="font-semibold line-clamp-2 mb-2">
                        {video.title}
                      </h3>

                      <p className="text-sm text-gray-500 mb-1">
                        {video.category}
                      </p>

                      <p className="text-sm text-gray-500 mb-4">
                        {video.views || 0} views
                      </p>

                      {/* OWNER ACTIONS */}

                      <div className="channel-video-actions flex gap-3">

                        <button
                          type="button"
                          onClick={() =>
                            handleEdit(video)
                          }
                          className="px-4 py-2 rounded-full bg-gray-100 hover:bg-gray-200 text-sm"
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            handleDelete(video._id)
                          }
                          className="px-4 py-2 rounded-full bg-red-100 hover:bg-red-200 text-red-600 text-sm"
                        >
                          Delete
                        </button>

                      </div>

                    </div>
                  </div>

                ))}

              </div>
            )}

          </div>

        </div>
      )}

      {/* ====================================== */}
      {/* SHORTS */}
      {/* ====================================== */}

      {activeTab === "Shorts" && (

        <p className="text-center py-16 text-gray-500">
          No shorts uploaded yet.
        </p>

      )}

      {/* ====================================== */}
      {/* LIVE */}
      {/* ====================================== */}

      {activeTab === "Live" && (

        <p className="text-center py-16 text-gray-500">
          No live streams yet.
        </p>

      )}

      {/* ====================================== */}
      {/* PLAYLISTS */}
      {/* ====================================== */}

      {activeTab === "Playlists" && (

        <p className="text-center py-16 text-gray-500">
          No playlists created yet.
        </p>

      )}

      {/* ====================================== */}
      {/* COMMUNITY */}
      {/* ====================================== */}

      {activeTab === "Community" && (

        <p className="text-center py-16 text-gray-500">
          No community posts yet.
        </p>

      )}

    </div>
  );
}

export default Channel;