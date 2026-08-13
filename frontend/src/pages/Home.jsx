import React, { useEffect, useState } from "react";
import axios from "axios";
import VideoCard from "../Components/VideoCard";
import FilterBar from "../Components/FilterBar.jsx";

function Home({ isSidebarOpen, search }) {
  const [category, setCategory] = useState("All");

  const [videos, setVideos] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  // ==========================================
  // FETCH VIDEOS FROM BACKEND
  // ==========================================
  const fetchVideos = async () => {
    try {
      setLoading(true);
      setError("");

      const params = {};

      // Search by title
      if (search && search.trim()) {
        params.search = search.trim();
      }

      // Category filter
      if (category && category !== "All") {
        params.category = category;
      }

      const response = await axios.get(
        "http://localhost:5000/api/videos",
        {
          params,
        }
      );

      /*
        Expected backend response:

        {
          videos: [...]
        }

        This also supports a backend that
        directly returns an array.
      */
      const fetchedVideos =
        response.data.videos || response.data;

      setVideos(fetchedVideos);
    } catch (error) {
      console.error("FETCH VIDEOS ERROR:", error);

      setError(
        error.response?.data?.message ||
          "Failed to load videos"
      );

      setVideos([]);
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // FETCH WHEN SEARCH OR CATEGORY CHANGES
  // ==========================================
  useEffect(() => {
    fetchVideos();
  }, [search, category]);

  return (
    <div
      className={`vc-homepage ${
        !isSidebarOpen ? "expanded" : ""
      }`}
    >
      <main className="vc-home">

        {/* ====================================
            FILTER BAR
        ==================================== */}
        <FilterBar
          category={category}
          setCategory={setCategory}
        />

        {/* ====================================
            LOADING
        ==================================== */}
        {loading && (
          <div className="no-videos">
            <h3>Loading videos...</h3>
          </div>
        )}

        {/* ====================================
            ERROR
        ==================================== */}
        {!loading && error && (
          <div className="no-videos">
            <h3>Unable to load videos</h3>

            <p>{error}</p>

            <button
              type="button"
              onClick={fetchVideos}
            >
              Try Again
            </button>
          </div>
        )}

        {/* ====================================
            VIDEOS
        ==================================== */}
        {!loading &&
          !error &&
          videos.length > 0 && (
            <div className="vc-videogrid">

              {videos.map((video) => (
                <VideoCard
                  key={video._id || video.videoId}
                  video={video}
                />
              ))}

            </div>
          )}

        {/* ====================================
            NO VIDEOS
        ==================================== */}
        {!loading &&
          !error &&
          videos.length === 0 && (
            <div className="no-videos">

              <h3>No videos found</h3>

              <p>
                {search
                  ? `No videos found for "${search}"`
                  : "Try another search or category."}
              </p>

            </div>
          )}

      </main>
    </div>
  );
}

export default Home;