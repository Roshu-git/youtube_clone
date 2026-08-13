import React from "react";
import { Link } from "react-router-dom";

function VideoCard({ video }) {
  if (!video) {
    return null;
  }

  // ==========================================
  // GET VIDEO ID
  // ==========================================

  const videoId =
    video._id ||
    video.id ||
    video.videoId;

  // ==========================================
  // DEBUG
  // ==========================================

  console.log("VIDEO CARD DATA:", video);
  console.log("VIDEO CARD ID:", videoId);

  // Do not create /video/undefined
  if (!videoId) {
    console.error(
      "VIDEO CARD ERROR: Video ID is missing",
      video
    );

    return (
      <div className="vc-videocard">
        <div className="p-4 text-red-500">
          Video ID is missing
        </div>
      </div>
    );
  }

  // ==========================================
  // CHANNEL NAME
  // ==========================================

  const channelName =
    video.channel?.channelName ||
    video.channelName ||
    "Unknown Channel";

  // ==========================================
  // FORMAT VIEWS
  // ==========================================

  function formatViews(views = 0) {
    if (views >= 1000000) {
      return `${(views / 1000000).toFixed(1)}M views`;
    }

    if (views >= 1000) {
      return `${(views / 1000).toFixed(1)}K views`;
    }

    return `${views} views`;
  }

  // ==========================================
  // FORMAT DATE
  // ==========================================

  function formatDate(date) {
    if (!date) {
      return "";
    }

    const uploadDate = new Date(date);

    if (Number.isNaN(uploadDate.getTime())) {
      return "";
    }

    const now = new Date();

    const difference = Math.floor(
      (now - uploadDate) /
        (1000 * 60 * 60 * 24)
    );

    if (difference <= 0) {
      return "Today";
    }

    if (difference === 1) {
      return "1 day ago";
    }

    if (difference < 30) {
      return `${difference} days ago`;
    }

    if (difference < 365) {
      return `${Math.floor(
        difference / 30
      )} months ago`;
    }

    return `${Math.floor(
      difference / 365
    )} years ago`;
  }

  return (
    <div className="vc-videocard">

      {/* =================================
          THUMBNAIL
      ================================= */}

      <Link
        to={`/video/${videoId}`}
        className="vc-thumbnail-wrapper"
      >
        <img
          src={video.thumbnailUrl}
          alt={video.title || "Video"}
          className="thumbnail"
          loading="lazy"
        />

        {video.duration && (
          <span className="vc-duration">
            {video.duration}
          </span>
        )}
      </Link>

      {/* =================================
          VIDEO INFORMATION
      ================================= */}

      <div className="vc-videoinfo flex justify-between">

        <div className="vc-videoinfo-inner">

          {/* TITLE */}

          <Link to={`/video/${videoId}`}>
            <h4>{video.title}</h4>
          </Link>

          {/* CHANNEL */}

          <div className="vc-channel">

            <p>
              {channelName}
            </p>

            {video.channel?.verified && (
              <span className="vc-verified">
                ✓
              </span>
            )}

          </div>

          {/* VIEWS + DATE */}

          <p className="vc-meta">

            {formatViews(video.views)}

            {(video.uploadDate ||
              video.createdAt) && (
              <>
                {" • "}
                {formatDate(
                  video.uploadDate ||
                  video.createdAt
                )}
              </>
            )}

          </p>

        </div>

        {/* THREE DOT MENU */}

        <div className="vc-video-dotbtn">

          <button
            type="button"
            className="vc-menu"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
          >
            ⋮
          </button>

        </div>

      </div>

    </div>
  );
}

export default VideoCard;