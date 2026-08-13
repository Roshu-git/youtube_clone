import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import videos from "../data/videos";
import {
  Search,
  User,
  LogOut,
  Menu,
  X,
  ThumbsUp,
  ThumbsDown,
  Share2
} from "lucide-react";

function VideoPlayer({ isSidebarOpen }) {
  const { id } = useParams();

  const video = videos.find((item) => item.videoId === id);

  if (!video) {
    return <h2>Video not found</h2>;
  }

  // State
  const [likes, setLikes] = useState(video.likes || 0);
  const [dislikes, setDislikes] = useState(video.dislikes || 0);
  const [userReaction, setUserReaction] = useState(null);

  const [comments, setComments] = useState(video.comments || []);
  const [newComment, setNewComment] = useState("");

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

        {/* LEFT / MAIN SECTION */}
        <main className="vc-watch-main">

          {/* Video Player */}
          <div className="vc-player">
            <video
              controls
              width="100%"
              poster={video.thumbnailUrl}
              className="vc-video-element"
            >
              <source src={video.videoUrl} type="video/mp4" />
              Your browser does not support the video tag.
            </video>

            {video.duration && (
              <span className="vc-player-duration">
                {video.duration}
              </span>
            )}
          </div>

          <div className="vc-playeritem">

            {/* Title */}
            <h1 className="vc-watch-title">
              {video.title}
            </h1>

            {/* Views and Date */}
            <div className="vc-watch-meta">
              <span>{formatViews(video.views)}</span>
              <span> • </span>
              <span>{formatDate(video.uploadDate)}</span>
            </div>

            {/* Channel Section */}
            <div className="vc-channel-section">
              <div className="vc-channel-left">
                {video.channelLogo && (
                  <img
                    src={video.channelLogo}
                    alt={video.channelName}
                    className="vc-watch-channel-logo"
                  />
                )}

                <div className="vc-channel-details">
                  <h3>{video.channelName}</h3>
                  <p>
                    {formatSubscribers(video.subscribers)} subscribers
                  </p>
                </div>
              </div>

              <div className="vc-channel-actions">
                <button className="vc-join-btn">Join</button>
                <button className="vc-subscribe-btn">
                  Subscribe
                </button>
              </div>

              {/* Action buttons */}
              <div className="vc-action-section">
                <button className="flex items-center gap-2"
                  onClick={() => {
                    if (userReaction === "like") {
                      setLikes(likes - 1);
                      setUserReaction(null);
                    } else {
                      if (userReaction === "dislike") {
                        setDislikes(dislikes - 1);
                      }
                      setLikes(likes + 1);
                      setUserReaction("like");
                    }
                  }}
                >
                    <ThumbsUp size={20} />
                 {formatNumber(likes)}
                </button>

                <button className="flex items-center gap-2"
                  onClick={() => {
                    if (userReaction === "dislike") {
                      setDislikes(dislikes - 1);
                      setUserReaction(null);
                    } else {
                      if (userReaction === "like") {
                        setLikes(likes - 1);
                      }
                      setDislikes(dislikes + 1);
                      setUserReaction("dislike");
                    }
                  }}
                >
                    <ThumbsDown size={20} />
                  {formatNumber(dislikes)}
                </button>

                <button className="sharebtn flex items-center gap-2" onClick={() => {
    navigator.share?.({
      title: video.title,
      text: video.description,
      url: window.location.href
    });
  }}>
                    <Share2 size={20} /> Share</button>
                <button className="dotbtn">⋮</button>

              </div>
          </div>

            {/* Description */}
            <div className="vc-description">
              <strong>{formatViews(video.views)}</strong>
              <p>{video.description}</p>
            </div>

            {/* COMMENTS */}
            <div className="vc-comments">

              <h2>{comments.length} Comments</h2>

              {/* Add comment */}
              <div className="vc-add-comment">

                <div className="vc-user-avatar">U</div>

                <input
                  type="text"
                  placeholder="Add a comment..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                />

                <button
                  onClick={() => {
                    if (!newComment.trim()) return;

                    const comment = {
                      commentId: Date.now().toString(),
                      userName: "You",
                      text: newComment,
                    };

                    setComments([comment, ...comments]);
                    setNewComment("");
                  }}
                >
                  Comment
                </button>

              </div>

              {/* Existing comments */}
              {comments.map((comment) => (

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

                    <h4>{comment.userName || comment.userId}</h4>

                    <p>{comment.text}</p>

                    <div className="vc-comment-actions">

                      <button className="flex items-center gap-2"> <ThumbsUp size={20} /></button>
                      <button><ThumbsDown size={20} /></button>
                      <button>Reply</button>

                      <button
                        onClick={() => {
                          const updated = prompt(
                            "Edit comment",
                            comment.text
                          );

                          if (updated) {
                            setComments(
                              comments.map((c) =>
                                c.commentId === comment.commentId
                                  ? { ...c, text: updated }
                                  : c
                              )
                            );
                          }
                        }}
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => {
                          setComments(
                            comments.filter(
                              (c) => c.commentId !== comment.commentId
                            )
                          );
                        }}
                      >
                        Delete
                      </button>

                    </div>

                  </div>

                </div>
              ))}

            </div>

          </div>

        </main>

        {/* RIGHT / RECOMMENDED */}
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
                  <span>{item.duration}</span>
                )}

              </div>

              <div className="vc-recommended-info">

                <h4>{item.title}</h4>
                <p>{item.channelName}</p>
                <p>{formatViews(item.views)}</p>

              </div>

            </Link>
          ))}

        </aside>

      </div>
    </div>
  );
}

/* Helper Functions */

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
    (now - uploadDate) / (1000 * 60 * 60 * 24)
  );

  if (difference === 0) return "Today";
  if (difference === 1) return "1 day ago";
  if (difference < 30) return `${difference} days ago`;
  if (difference < 365) return `${Math.floor(difference / 30)} months ago`;

  return `${Math.floor(difference / 365)} years ago`;
}

export default VideoPlayer;