const express = require("express");

const Comment = require("../models/Comment.model");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();


// ======================================
// GET COMMENTS FOR VIDEO
// ======================================

router.get("/:videoId", async (req, res) => {
  try {

    const comments = await Comment.find({
      video: req.params.videoId
    })
      .populate("user", "username avatar")
      .sort({ createdAt: -1 });

    res.json(comments);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Server error"
    });

  }
});


// ======================================
// ADD COMMENT
// ======================================

router.post("/:videoId", authMiddleware, async (req, res) => {
  try {

    const { text } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({
        message: "Comment cannot be empty"
      });
    }

    const comment = await Comment.create({
      video: req.params.videoId,
      user: req.user.userId,
      text: text.trim()
    });

    const populatedComment =
      await Comment.findById(comment._id)
        .populate("user", "username avatar");

    res.status(201).json({
      message: "Comment added successfully",
      comment: populatedComment
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Server error"
    });

  }
});


// ======================================
// EDIT COMMENT
// ======================================

router.put("/:commentId", authMiddleware, async (req, res) => {
  try {

    const { text } = req.body;

    const comment = await Comment.findById(
      req.params.commentId
    );

    if (!comment) {
      return res.status(404).json({
        message: "Comment not found"
      });
    }

    if (
      comment.user.toString() !==
      req.user.userId
    ) {
      return res.status(403).json({
        message: "You can only edit your own comment"
      });
    }

    comment.text = text;

    await comment.save();

    res.json({
      message: "Comment updated successfully",
      comment
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Server error"
    });

  }
});


// ======================================
// DELETE COMMENT
// ======================================

router.delete("/:commentId", authMiddleware, async (req, res) => {
  try {

    const comment = await Comment.findById(
      req.params.commentId
    );

    if (!comment) {
      return res.status(404).json({
        message: "Comment not found"
      });
    }

    if (
      comment.user.toString() !==
      req.user.userId
    ) {
      return res.status(403).json({
        message: "You can only delete your own comment"
      });
    }

    await Comment.findByIdAndDelete(
      req.params.commentId
    );

    res.json({
      message: "Comment deleted successfully"
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Server error"
    });

  }
});

module.exports = router;