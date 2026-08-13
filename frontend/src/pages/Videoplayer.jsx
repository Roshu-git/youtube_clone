import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
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
  // IMPORTANT:
  // App.jsx route must be: /watch/:videoId
  const { videoId } = useParams();

  const { user, token } = useAuth();

  const [video, setVideo] = useState(null);
  const [comments, setComments] = useState([]);

  const [newComment, setNewComment] = useState("");

  const [loading, setLoading] = useState(true);
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [error, setError] = useState("");

  // =====================================================
  // DEBUG VIDEO ID
  // =====================================================

  console.log("VIDEO ID FROM URL:", videoId);

  // =====================================================
  // GET VIDEO
  // =====================================================

  useEffect(() => {
    if (!videoId) {
      console.error("VIDEO ID IS UNDEFINED");

      setError("Video ID is missing from the URL.");
      setLoading(false);

      return;
    }

    const fetchVideo = async () => {
      try {
        setLoading(true);
        setError("");

        console.log(
          "FETCHING VIDEO:",
          `${API_URL}/videos/${videoId}`
        );

        const response = await axios.get(
          `${API_URL}/videos/${videoId}`
        );

        console.log("VIDEO RESPONSE:", response.data);

        setVideo(
          response.data.video || response.data
        );

      } catch (error) {
        console.error(
          "FETCH VIDEO ERROR:",
          error
        );

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
  // GET COMMENTS
  // =====================================================

  useEffect(() => {
    if (!videoId) {
      return;
    }

    const fetchComments = async () => {
      try {
        setCommentsLoading(true);

        console.log(
          "FETCHING COMMENTS:",
          `${API_URL}/comments/video/${videoId}`
        );

        const response = await axios.get(
          `${API_URL}/comments/video/${videoId}`
        );

        console.log(
          "COMMENTS RESPONSE:",
          response.data
        );

        setComments(
          response.data.comments ||
          response.data ||
          []
        );

      } catch (error) {
        console.error(
          "FETCH COMMENTS ERROR:",
          error
        );

        setComments([]);

      } finally {
        setCommentsLoading(false);
      }
    };

    fetchComments();
  }, [videoId]);

  // =====================================================
  // ADD COMMENT
  // =====================================================

  const handleAddComment = async () => {
    if (!token) {
      alert("Please sign in to comment.");
      return;
    }

    if (!newComment.trim()) {
      return;
    }

    if (!videoId) {
      alert("Video ID is missing.");
      return;
    }

    try {
      setCommentsLoading(true);

      const response = await axios.post(
        `${API_URL}/comments`,
        {
          videoId: videoId,
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
      console.error(
        "ADD COMMENT ERROR:",
        error
      );

      alert(
        error.response?.data?.message ||
        "Unable to add comment"
      );

    } finally {
      setCommentsLoading(false);
    }
  };

  // =====================================================
  // EDIT COMMENT
  // =====================================================

  const handleUpdateComment = async (
    commentId,
    text
  ) => {
    if (!token) {
      return false;
    }

    try {
      const response = await axios.put(
        `${API_URL}/comments/${commentId}`,
        {
          text,
        },
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
    if (!token) {
      return;
    }

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
      alert(
        "Please sign in to like this video."
      );
      return;
    }

    if (!videoId) {
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
      }));

    } catch (error) {
      console.error(
        "LIKE ERROR:",
        error
      );

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

    if (!videoId) {
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
    if (!video) {
      return;
    }

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
    } catch (error) {
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
        !isSidebarOpen
          ? "expanded"
          : ""
      }`}
    >
      <div className="vc-watch-layout">

        <main className="vc-watch-main">

          {/* VIDEO PLAYER */}

          <div className="vc-player">

            <video
              controls
              width="100%"
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

          <div className="vc-playeritem">

            {/* TITLE */}

            <h1 className="vc-watch-title">
              {video.title}
            </h1>

            {/* VIEWS + DATE */}

            <div className="vc-watch-meta">

              <span>
                {formatViews(video.views)}
              </span>

              <span> • </span>

              <span>
                {formatDate(
                  video.uploadDate ||
                  video.createdAt
                )}
              </span>

            </div>

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
                      video.channel?.subscribers ||
                      video.subscribers ||
                      0
                    )}{" "}
                    subscribers
                  </p>

                </div>

              </div>

              <div className="vc-channel-actions">

                <button className="vc-subscribe-btn">
                  Subscribe
                </button>

              </div>

            </div>

            {/* LIKE / DISLIKE / SHARE */}

            <div className="vc-action-section">

              <button
                className="flex items-center gap-2"
                onClick={handleLike}
              >
                <ThumbsUp size={20} />

                {formatNumber(
                  getReactionCount(
                    video.likes
                  )
                )}
              </button>

              <button
                className="flex items-center gap-2"
                onClick={handleDislike}
              >
                <ThumbsDown size={20} />

                {formatNumber(
                  getReactionCount(
                    video.dislikes
                  )
                )}
              </button>

              <button
                className="sharebtn flex items-center gap-2"
                onClick={handleShare}
              >
                <Share2 size={20} />

                Share
              </button>

            </div>

            {/* DESCRIPTION */}

            <div className="vc-description">

              <strong>
                {formatViews(video.views)}
              </strong>

              <p>
                {video.description}
              </p>

            </div>

            {/* COMMENTS */}

            <div className="vc-comments">

              <h2>
                {comments.length} Comments
              </h2>

              {/* ADD COMMENT */}

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

              {/* COMMENT LIST */}

              {comments.length === 0 ? (

                <p>
                  No comments yet. Be the
                  first to comment!
                </p>

              ) : (

                comments.map((comment) => (

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

                ))

              )}

            </div>

          </div>

        </main>

      </div>
    </div>
  );
}

// =====================================================
// HELPER FUNCTIONS
// =====================================================

function getChannelName(video) {
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

function getReactionCount(reaction) {
  if (Array.isArray(reaction)) {
    return reaction.length;
  }

  return reaction || 0;
}

function formatViews(views) {
  if (views >= 1000000) {
    return `${(
      views / 1000000
    ).toFixed(1)}M views`;
  }

  if (views >= 1000) {
    return `${(
      views / 1000
    ).toFixed(1)}K views`;
  }

  return `${views || 0} views`;
}

function formatNumber(number) {
  if (number >= 1000000) {
    return `${(
      number / 1000000
    ).toFixed(1)}M`;
  }

  if (number >= 1000) {
    return `${(
      number / 1000
    ).toFixed(1)}K`;
  }

  return number;
}

function formatSubscribers(number) {
  if (number >= 1000000) {
    return `${(
      number / 1000000
    ).toFixed(1)}M`;
  }

  if (number >= 1000) {
    return `${(
      number / 1000
    ).toFixed(1)}K`;
  }

  return number;
}

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
    return `${Math.floor(
      difference / 30
    )} months ago`;
  }

  return `${Math.floor(
    difference / 365
  )} years ago`;
}

export default VideoPlayer;