import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";

function Comment({ comment, onUpdate, onDelete }) {
  const { user } = useAuth();

  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(comment.text || "");

  const loggedInUserId = user?._id || user?.id;

  const commentUserId =
    comment.user?._id ||
    comment.user?.id ||
    comment.userId;

  const isOwner =
    loggedInUserId &&
    commentUserId &&
    String(loggedInUserId) === String(commentUserId);

  const username =
    comment.user?.username ||
    comment.username ||
    "User";

  const handleEdit = async () => {
    if (!editText.trim()) return;

    const success = await onUpdate(
      comment._id,
      editText.trim()
    );

    if (success) {
      setIsEditing(false);
    }
  };

  const handleDelete = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this comment?"
    );

    if (!confirmed) return;

    await onDelete(comment._id);
  };

  return (
    <div className="vc-comment">

      {/* Avatar */}
      <div className="vc-comment-avatar">
        {username.charAt(0).toUpperCase()}
      </div>

      <div className="vc-comment-body">

        {/* Username */}
        <h4>{username}</h4>

        {isEditing ? (
          <div className="vc-edit-comment">

            <input
              type="text"
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              autoFocus
            />

            <div className="vc-comment-actions">

              <button onClick={handleEdit}>
                Save
              </button>

              <button
                onClick={() => {
                  setIsEditing(false);
                  setEditText(comment.text || "");
                }}
              >
                Cancel
              </button>

            </div>

          </div>
        ) : (
          <p>{comment.text}</p>
        )}

        {/* Only comment owner can edit/delete */}
        {!isEditing && isOwner && (
          <div className="vc-comment-actions">

            <button onClick={() => setIsEditing(true)}>
              Edit
            </button>

            <button onClick={handleDelete}>
              Delete
            </button>

          </div>
        )}

      </div>
    </div>
  );
}

export default Comment;