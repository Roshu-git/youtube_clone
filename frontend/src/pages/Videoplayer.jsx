
import React from "react";
import { useParams, Link } from "react-router-dom";
import videos from "../data/videos";

function VideoPlayer({ isSidebarOpen }) {
  const { id } = useParams();

  const video = videos.find(
    (item) => item.videoId === id
  );

  if (!video) {
    return <h2>Video not found</h2>;
  }

  // Recommended videos
  const recommendedVideos = videos.filter(
    (item) => item.videoId !== video.videoId
  );

  return (
    <div
      className={`vc-watchpage ${
        !isSidebarOpen ? "expanded" : ""
      }`}
    >

      <div className="vc-watch-layout">

        {/* =========================
            LEFT / MAIN SECTION
        ========================= */}

        <main className="vc-watch-main">

          {/* Video Player */}
          <div className="vc-player">

            <img
              src={video.thumbnailUrl}
              alt={video.title}
            />

            {/* Play button */}
            <button className="vc-play-button">
              ▶
            </button>

            {/* Duration */}
            <span className="vc-player-duration">
              {video.duration}
            </span>

          </div>


          {/* Video Title */}
          <div className="vc-playeritem">
          <h1 className="vc-watch-title">
            {video.title}
          </h1>


          {/* Views and Date */}
          <div className="vc-watch-meta">
            <span>
              {formatViews(video.views)}
            </span>

            <span> • </span>

            <span>
              {formatDate(video.uploadDate)}
            </span>
          </div>


          {/* Channel Section */}
          <div className="vc-channel-section">

            <div className="vc-channel-left">

              {/* <img
                src={video.channelLogo}
                alt={video.channelName}
                className="vc-watch-channel-logo"
              /> */}

              <div className="vc-channel-details">

                <h3>
                  {video.channelName}
                </h3>

                <p>
                  {formatSubscribers(video.subscribers)}
                  {" "}subscribers
                </p>

              </div>

            </div>


            {/* Subscribe */}
            <button className="vc-subscribe-btn">
              Subscribe
            </button>

          </div>


          {/* Action buttons */}
          <div className="vc-action-section">

            <button>
              👍 {formatNumber(video.likes)}
            </button>

            <button>
              👎 {formatNumber(video.dislikes)}
            </button>

            <button>
              ↗ Share
            </button>

            <button>
              ⋮
            </button>

          </div>


          {/* Description */}
          <div className="vc-description">

            <strong>
              {formatViews(video.views)}
            </strong>

            <p>
              {video.description}
            </p>

          </div>


          {/* =========================
              COMMENTS
          ========================= */}

          <div className="vc-comments">

            <h2>
              {video.comments.length} Comments
            </h2>


            {/* Add comment */}
            <div className="vc-add-comment">

              <div className="vc-user-avatar">
                U
              </div>

              <input
                type="text"
                placeholder="Add a comment..."
              />

            </div>


            {/* Existing comments */}
            {video.comments.map((comment) => (

              <div
                className="vc-comment"
                key={comment.commentId}
              >

                <div className="vc-comment-avatar">
                  {comment.userName
                    ? comment.userName.charAt(0)
                    : "U"}
                </div>


                <div className="vc-comment-body">

                  <h4>
                    {comment.userName || comment.userId}
                  </h4>

                  <p>
                    {comment.text}
                  </p>

                  <div className="vc-comment-actions">

                    <button>👍</button>

                    <button>👎</button>

                    <button>Reply</button>

                  </div>

                </div>

              </div>

            ))}

          </div>
          </div>

        </main>


        {/* =========================
            RIGHT / RECOMMENDED
        ========================= */}

        <aside className="vc-recommended">

          <h3>Recommended</h3>

          {recommendedVideos.map((item) => (

            <Link
              to={`/watch/${item.videoId}`}
              className="vc-recommended-card"
              key={item.videoId}
            >

              <div className="vc-recommended-thumbnail">

                <img
                  src={item.thumbnailUrl}
                  alt={item.title}
                />

                {item.duration && (
                  <span>
                    {item.duration}
                  </span>
                )}

              </div>


              <div className="vc-recommended-info">

                <h4>
                  {item.title}
                </h4>

                <p>
                  {item.channelName}
                </p>

                <p>
                  {formatViews(item.views)}
                </p>

              </div>

            </Link>

          ))}

        </aside>

      </div>

    </div>
  );
}


/* =========================
   HELPER FUNCTIONS
========================= */

function formatViews(views) {
  if (views >= 1000000) {
    return `${(views / 1000000).toFixed(1)}M views`;
  }

  if (views >= 1000) {
    return `${(views / 1000).toFixed(1)}K views`;
  }

  return `${views} views`;
}


function formatNumber(number) {
  if (number >= 1000000) {
    return `${(number / 1000000).toFixed(1)}M`;
  }

  if (number >= 1000) {
    return `${(number / 1000).toFixed(1)}K`;
  }

  return number;
}


function formatSubscribers(number) {
  if (number >= 1000000) {
    return `${(number / 1000000).toFixed(1)}M`;
  }

  if (number >= 1000) {
    return `${(number / 1000).toFixed(1)}K`;
  }

  return number;
}


function formatDate(date) {
  const uploadDate = new Date(date);
  const now = new Date();

  const difference = Math.floor(
    (now - uploadDate) /
      (1000 * 60 * 60 * 24)
  );

  if (difference === 0) {
    return "Today";
  }

  if (difference === 1) {
    return "1 day ago";
  }

  if (difference < 30) {
    return `${difference} days ago`;
  }

  if (difference < 365) {
    return `${Math.floor(difference / 30)} months ago`;
  }

  return `${Math.floor(difference / 365)} years ago`;
}


export default VideoPlayer;