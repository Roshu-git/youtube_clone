import express from "express";

import {
  createComment,
  getCommentsByVideo,
  updateComment,
  deleteComment,
} from "../controllers/comment.controller.js";

import authMiddleware from "../middleware/auth.middleware.js";

const router = express.Router();

// Protected
router.post("/", authMiddleware, createComment);

// Public
router.get("/video/:videoId", getCommentsByVideo);

// Protected
router.put("/:commentId", authMiddleware, updateComment);
router.delete("/:commentId", authMiddleware, deleteComment);

export default router;