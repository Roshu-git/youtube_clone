import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";

import {
  ThumbsUp,
  ThumbsDown,
  Share2,
} from "lucide-react";

import { useAuth } from "../context/AuthContext";
import Comment from "../Components/Comment";

const API_URL = "http://localhost:5000/api";

function VideoPlayer({ isSidebarOpen }) {
  const { videoId } = useParams();
  const { user, token } = useAuth();

  const [video, setVideo] = useState(null);
  const [comments, setComments] = useState([]);
  const [recommendedVideos, setRecommendedVideos] = useState([]);
  const [newComment, setNewComment] = useState("");

  const [loading, setLoading] = useState(true);
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [recommendationsLoading, setRecommendationsLoading] =
    useState(true);
  const [error, setError] = useState("");

  // =====================================================
  // FETCH CURRENT VIDEO
  // =====================================================

  useEffect(() => {
    if (!videoId) {
      setError("Video ID is missing from the URL.");
      setLoading(false);
      return;
    }

    const fetchVideo = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await axios.get(
          `${API_URL}/videos/${videoId}`
        );

        setVideo(response.data.video || response.data);
      } catch (error) {
        console.error("FETCH VIDEO ERROR:", error);

        setError(
          error.response?.data?.message ||
            "Unable to load video"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchVideo();
  }, [videoId]);

  // =====================================================
  // FETCH COMMENTS
  // =====================================================

  useEffect(() => {
    if (!videoId) return;

    const fetchComments = async () => {
      try {
        setCommentsLoading(true);

        const response = await axios.get(
          `${API_URL}/comments/video/${videoId}`
        );

        setComments(response.data.comments || []);
      } catch (error) {
        console.error("FETCH COMMENTS ERROR:", error);
        setComments([]);
      } finally {
        setCommentsLoading(false);
      }
    };

    fetchComments();
  }, [videoId]);

  // =====================================================
  // FETCH RECOMMENDED VIDEOS
  // =====================================================

  useEffect(() => {
    if (!videoId) return;

    const fetchRecommendedVideos = async () => {
      try {
        setRecommendationsLoading(true);

        const response = await axios.get(
          `${API_URL}/videos`
        );

        const videos =
          response.data.videos ||
          response.data ||
          [];

        const filteredVideos = videos.filter((item) => {
          const id =
            item._id ||
            item.id ||
            item.videoId;

          return String(id) !== String(videoId);
        });

        setRecommendedVideos(
          filteredVideos.slice(0, 10)
        );
      } catch (error) {
        console.error(
          "FETCH RECOMMENDED VIDEOS ERROR:",
          error
        );

        setRecommendedVideos([]);
      } finally {
        setRecommendationsLoading(false);
      }
    };

    fetchRecommendedVideos();
  }, [videoId]);

  // =====================================================
  // ADD COMMENT
  // =====================================================

  const handleAddComment = async () => {
    if (!token) {
      alert("Please sign in to comment.");
      return;
    }

    if (!newComment.trim()) return;

    if (!videoId) {
      alert("Video ID is missing.");
      return;
    }

    try {
      setCommentsLoading(true);

      const response = await axios.post(
        `${API_URL}/comments`,
        {
          videoId,
          text: newComment.trim(),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const createdComment =
        response.data.comment ||
        response.data;

      setComments((prev) => [
        createdComment,
        ...prev,
      ]);

      setNewComment("");
    } catch (error) {
      console.error("ADD COMMENT ERROR:", error);

      alert(
        error.response?.data?.message ||
          "Unable to add comment"
      );
    } finally {
      setCommentsLoading(false);
    }
  };

  // =====================================================
  // UPDATE COMMENT
  // =====================================================

  const handleUpdateComment = async (
    commentId,
    text
  ) => {
    if (!token) return false;

    try {
      const response = await axios.put(
        `${API_URL}/comments/${commentId}`,
        { text },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const updatedComment =
        response.data.comment ||
        response.data;

      setComments((prev) =>
        prev.map((comment) =>
          comment._id === commentId
            ? updatedComment
            : comment
        )
      );

      return true;
    } catch (error) {
      console.error(
        "UPDATE COMMENT ERROR:",
        error
      );

      alert(
        error.response?.data?.message ||
          "Unable to update comment"
      );

      return false;
    }
  };

  // =====================================================
  // DELETE COMMENT
  // =====================================================

  const handleDeleteComment = async (
    commentId
  ) => {
    if (!token) return;

    try {
      await axios.delete(
        `${API_URL}/comments/${commentId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setComments((prev) =>
        prev.filter(
          (comment) =>
            comment._id !== commentId
        )
      );
    } catch (error) {
      console.error(
        "DELETE COMMENT ERROR:",
        error
      );

      alert(
        error.response?.data?.message ||
          "Unable to delete comment"
      );
    }
  };

  // =====================================================
  // LIKE
  // =====================================================

  const handleLike = async () => {
    if (!token) {
      alert("Please sign in to like this video.");
      return;
    }

    try {
      const response = await axios.post(
        `${API_URL}/videos/${videoId}/like`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setVideo((prev) => ({
        ...prev,
        likes:
          response.data.likes ??
          prev.likes,
        dislikes:
          response.data.dislikes ??
          prev.dislikes,
      }));
    } catch (error) {
      console.error("LIKE ERROR:", error);

      alert(
        error.response?.data?.message ||
          "Unable to like video"
      );
    }
  };

  // =====================================================
  // DISLIKE
  // =====================================================

  const handleDislike = async () => {
    if (!token) {
      alert(
        "Please sign in to dislike this video."
      );
      return;
    }

    try {
      const response = await axios.post(
        `${API_URL}/videos/${videoId}/dislike`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setVideo((prev) => ({
        ...prev,
        likes:
          response.data.likes ??
          prev.likes,
        dislikes:
          response.data.dislikes ??
          prev.dislikes,
      }));
    } catch (error) {
      console.error(
        "DISLIKE ERROR:",
        error
      );

      alert(
        error.response?.data?.message ||
          "Unable to dislike video"
      );
    }
  };

  // =====================================================
  // SHARE
  // =====================================================

  const handleShare = async () => {
    if (!video) return;

    try {
      if (navigator.share) {
        await navigator.share({
          title: video.title,
          text: video.description,
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(
          window.location.href
        );

        alert("Video link copied!");
      }
    } catch {
      console.log("Share cancelled");
    }
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="vc-watchpage">
        <h2>Loading video...</h2>
      </div>
    );
  }

  // =====================================================
  // ERROR
  // =====================================================

  if (error || !video) {
    return (
      <div className="vc-watchpage">
        <h2>
          {error || "Video not found"}
        </h2>
      </div>
    );
  }

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <div
      className={`vc-watchpage ${
        !isSidebarOpen ? "expanded" : ""
      }`}
    >
      <div className="vc-watch-layout">

        {/* =================================================
            LEFT COLUMN
        ================================================= */}

        <main className="vc-watch-main">

          {/* VIDEO */}
          <div className="vc-player">
            <video
              controls
              poster={video.thumbnailUrl}
              className="vc-video-element"
            >
              <source
                src={video.videoUrl}
                type="video/mp4"
              />

              Your browser does not support
              the video tag.
            </video>
          </div>

          {/* VIDEO INFORMATION */}

          <div className="vc-playeritem">

            {/* TITLE */}

            <h1 className="vc-watch-title">
              {video.title}
            </h1>

            {/* CHANNEL + ACTIONS */}

            <div className="vc-video-info-row">

              {/* CHANNEL */}

              <div className="vc-channel-section">

                <div className="vc-channel-left">

                  <div className="vc-watch-channel-logo">
                    {getChannelName(video)
                      .charAt(0)
                      .toUpperCase()}
                  </div>

                  <div className="vc-channel-details">

                    <h3>
                      {getChannelName(video)}
                    </h3>

                    <p>
                      {formatSubscribers(
                        video.channelId
                          ?.subscribers ||
                          video.channel
                            ?.subscribers ||
                          video.subscribers ||
                          0
                      )}{" "}
                      subscribers
                    </p>

                  </div>

                </div>

                <button className="vc-subscribe-btn">
                  Subscribe
                </button>

              </div>

            </div>

            {/* ACTION BUTTONS */}

            <div className="vc-action-section">

              <button
                type="button"
                onClick={handleLike}
              >
                <ThumbsUp size={20} />

                <span>
                  {formatNumber(
                    getReactionCount(
                      video.likes
                    )
                  )}
                </span>
              </button>

              <button
                type="button"
                onClick={handleDislike}
              >
                <ThumbsDown size={20} />

                <span>
                  {formatNumber(
                    getReactionCount(
                      video.dislikes
                    )
                  )}
                </span>
              </button>

              <button
                type="button"
                className="sharebtn"
                onClick={handleShare}
              >
                <Share2 size={20} />
                <span>Share</span>
              </button>

            </div>

            {/* DESCRIPTION */}

            <div className="vc-description">

              <div className="vc-description-meta">
                {formatViews(video.views)}
                {" • "}
                {formatDate(
                  video.uploadDate ||
                    video.createdAt
                )}
              </div>

              <p>
                {video.description ||
                  "No description available."}
              </p>

            </div>

            {/* =================================================
                COMMENTS
            ================================================= */}

            <div className="vc-comments">

              <h2>
                {comments.length} Comments
              </h2>

              {user ? (
                <div className="vc-add-comment">

                  <div className="vc-user-avatar">
                    {user.username
                      ?.charAt(0)
                      .toUpperCase() ||
                      "U"}
                  </div>

                  <input
                    type="text"
                    placeholder="Add a comment..."
                    value={newComment}
                    onChange={(e) =>
                      setNewComment(
                        e.target.value
                      )
                    }
                    onKeyDown={(e) => {
                      if (
                        e.key === "Enter"
                      ) {
                        handleAddComment();
                      }
                    }}
                  />

                  <button
                    type="button"
                    onClick={
                      handleAddComment
                    }
                    disabled={
                      commentsLoading
                    }
                  >
                    {commentsLoading
                      ? "Posting..."
                      : "Post"}
                  </button>

                </div>
              ) : (
                <p>
                  Please sign in to add a
                  comment.
                </p>
              )}

              {commentsLoading &&
                comments.length === 0 && (
                  <p>
                    Loading comments...
                  </p>
                )}

              {!commentsLoading &&
                comments.length === 0 && (
                  <p>
                    No comments yet. Be the
                    first to comment!
                  </p>
                )}

              {comments.length > 0 && (
                <div className="vc-comment-list">

                  {comments.map(
                    (comment) => (
                      <Comment
                        key={comment._id}
                        comment={comment}
                        onUpdate={
                          handleUpdateComment
                        }
                        onDelete={
                          handleDeleteComment
                        }
                      />
                    )
                  )}

                </div>
              )}

            </div>

          </div>

        </main>

        {/* =================================================
            RIGHT COLUMN
        ================================================= */}

        <aside className="vc-recommended">

          <h2 className="vc-recommended-title">
            Recommended
          </h2>

          {recommendationsLoading ? (
            <div className="vc-recommended-loading">
              Loading videos...
            </div>
          ) : recommendedVideos.length === 0 ? (
            <div className="vc-recommended-loading">
              No recommended videos
            </div>
          ) : (
            <div className="vc-recommended-list">

              {recommendedVideos.map(
                (recommendedVideo) => {

                  const recommendedId =
                    recommendedVideo._id ||
                    recommendedVideo.id ||
                    recommendedVideo.videoId;

                  if (!recommendedId) {
                    return null;
                  }
                  return (
                    <Link
                      key={recommendedId}
                      to={`/watch/${recommendedId}`}
                      className="vc-recommended-card"
                    >

                      {/* RECOMMENDED THUMBNAIL */}

                      <div className="vc-recommended-thumbnail-wrapper">

                        <img
                          src={
                            recommendedVideo.thumbnailUrl
                          }
                          alt={
                            recommendedVideo.title ||
                            "Video"
                          }
                          className="vc-recommended-thumbnail"
                          loading="lazy"
                        />

                        {recommendedVideo.duration && (
                          <span className="vc-recommended-duration">
                            {
                              recommendedVideo.duration
                            }
                          </span>
                        )}

                      </div>

                      {/* RECOMMENDED INFO */}

                      <div className="vc-recommended-info">

                        <h3>
                          {
                            recommendedVideo.title
                          }
                        </h3>

                        <p className="vc-recommended-channel">
                          {getChannelName(
                            recommendedVideo
                          )}
                        </p>

                        <p className="vc-recommended-meta">

                          {formatViews(
                            recommendedVideo.views
                          )}

                          {" • "}

                          {formatDate(
                            recommendedVideo.uploadDate ||
                              recommendedVideo.createdAt
                          )}

                        </p>

                      </div>

                    </Link>
                  );
                }
              )}

            </div>
          )}

        </aside>

      </div>
    </div>
  );
}

// =====================================================
// CHANNEL NAME
// =====================================================

function getChannelName(video) {
  if (
    video.channelId &&
    typeof video.channelId === "object"
  ) {
    return (
      video.channelId.channelName ||
      "Unknown Channel"
    );
  }

  if (
    video.channel &&
    typeof video.channel === "object"
  ) {
    return (
      video.channel.channelName ||
      "Unknown Channel"
    );
  }

  return (
    video.channelName ||
    "Unknown Channel"
  );
}

// =====================================================
// REACTION COUNT
// =====================================================

function getReactionCount(reaction) {
  if (Array.isArray(reaction)) {
    return reaction.length;
  }

  return reaction || 0;
}

// =====================================================
// FORMAT VIEWS
// =====================================================

function formatViews(views = 0) {
  if (views >= 1000000) {
    return `${(views / 1000000).toFixed(1)}M views`;
  }

  if (views >= 1000) {
    return `${(views / 1000).toFixed(1)}K views`;
  }

  return `${views} views`;
}

// =====================================================
// FORMAT NUMBER
// =====================================================

function formatNumber(number = 0) {
  if (number >= 1000000) {
    return `${(number / 1000000).toFixed(1)}M`;
  }

  if (number >= 1000) {
    return `${(number / 1000).toFixed(1)}K`;
  }

  return number;
}

// =====================================================
// FORMAT SUBSCRIBERS
// =====================================================

function formatSubscribers(number = 0) {
  if (number >= 1000000) {
    return `${(number / 1000000).toFixed(1)}M`;
  }

  if (number >= 1000) {
    return `${(number / 1000).toFixed(1)}K`;
  }

  return number;
}

// =====================================================
// FORMAT DATE
// =====================================================

function formatDate(date) {
  if (!date) return "";

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

export default VideoPlayer;