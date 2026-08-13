import React from "react";
import { Link } from "react-router-dom";

function VideoCard({ video }) {
  // MongoDB ID
  const videoId = video._id || video.videoId;

  // Channel can come from populated MongoDB channel object
  const channelName =
    video.channel?.channelName ||
    video.channelName ||
    "Unknown Channel";

  // ==============================
  // FORMAT VIEWS
  // ==============================
  function formatViews(views = 0) {
    if (views >= 1000000) {
      return `${(views / 1000000).toFixed(1)}M views`;
    }

    if (views >= 1000) {
      return `${(views / 1000).toFixed(1)}K views`;
    }

    return `${views} views`;
  }

  // ==============================
  // FORMAT UPLOAD DATE
  // ==============================
  function formatDate(date) {
    if (!date) {
      return "";
    }

    const uploadDate = new Date(date);
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
          alt={video.title}
          className="thumbnail"
          loading="lazy"
        />

        {/* Video duration */}
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

          {/* Title */}
          <Link to={`/video/${videoId}`}>
            <h4>{video.title}</h4>
          </Link>


          {/* Channel */}
          <div className="vc-channel">

            <p>
              {channelName}
            </p>

            {/* Verified channel */}
            {video.channel?.verified && (
              <span className="vc-verified">
                ✓
              </span>
            )}

          </div>


          {/* Views + Upload date */}
          <p className="vc-meta">

            {formatViews(video.views)}

            {video.uploadDate && (
              <>
                {" • "}
                {formatDate(video.uploadDate)}
              </>
            )}

          </p>

        </div>


        {/* Three dot menu */}
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