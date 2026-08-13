import Comment from "../models/Comment.model.js";
import Video from "../models/Video.model.js";

// =============================
// CREATE COMMENT
// =============================
export const createComment = async (req, res) => {
  try {
    const { videoId, text } = req.body;

    if (!videoId || !text || !text.trim()) {
      return res.status(400).json({
        message: "Video ID and comment text are required",
      });
    }

    const video = await Video.findById(videoId);

    if (!video) {
      return res.status(404).json({
        message: "Video not found",
      });
    }

    const comment = await Comment.create({
      video: videoId,
      user: req.user.id,
      text: text.trim(),
    });

    const populatedComment = await Comment.findById(comment._id)
      .populate("user", "username avatar");

    return res.status(201).json({
      message: "Comment added successfully",
      comment: populatedComment,
    });
  } catch (error) {
    console.error("CREATE COMMENT ERROR:", error);

    return res.status(500).json({
      message: "Failed to add comment",
    });
  }
};

// =============================
// GET COMMENTS FOR VIDEO
// =============================
export const getCommentsByVideo = async (req, res) => {
  try {
    const { videoId } = req.params;

    const comments = await Comment.find({
      video: videoId,
    })
      .populate("user", "username avatar")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      count: comments.length,
      comments,
    });
  } catch (error) {
    console.error("GET COMMENTS ERROR:", error);

    return res.status(500).json({
      message: "Failed to fetch comments",
    });
  }
};

// =============================
// UPDATE COMMENT
// =============================
export const updateComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const { text } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({
        message: "Comment text is required",
      });
    }

    const comment = await Comment.findById(commentId);

    if (!comment) {
      return res.status(404).json({
        message: "Comment not found",
      });
    }

    // Comment model uses "user", not "owner"
    if (comment.user.toString() !== req.user.id) {
      return res.status(403).json({
        message: "You can only edit your own comments",
      });
    }

    comment.text = text.trim();

    await comment.save();

    const updatedComment = await Comment.findById(comment._id)
      .populate("user", "username avatar");

    return res.status(200).json({
      message: "Comment updated successfully",
      comment: updatedComment,
    });
  } catch (error) {
    console.error("UPDATE COMMENT ERROR:", error);

    return res.status(500).json({
      message: "Failed to update comment",
    });
  }
};

// =============================
// DELETE COMMENT
// =============================
export const deleteComment = async (req, res) => {
  try {
    const { commentId } = req.params;

    const comment = await Comment.findById(commentId);

    if (!comment) {
      return res.status(404).json({
        message: "Comment not found",
      });
    }

    // Only comment owner can delete
    if (comment.user.toString() !== req.user.id) {
      return res.status(403).json({
        message: "You can only delete your own comments",
      });
    }

    await Comment.findByIdAndDelete(commentId);

    return res.status(200).json({
      message: "Comment deleted successfully",
    });
  } catch (error) {
    console.error("DELETE COMMENT ERROR:", error);

    return res.status(500).json({
      message: "Failed to delete comment",
    });
  }
};