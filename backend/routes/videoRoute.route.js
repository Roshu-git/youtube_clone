import express from "express";

import {
  getVideos,
  getVideoById,
  createVideo,
  updateVideo,
  deleteVideo,
  likeVideo,
  dislikeVideo,
} from "../controllers/video.controller.js";

import authMiddleware from "../middleware/auth.middleware.js";

const router = express.Router();

// Public
router.get("/", getVideos);

router.get("/:id", getVideoById);

// Protected
router.post("/", authMiddleware, createVideo);

router.put("/:id", authMiddleware, updateVideo);

router.delete("/:id", authMiddleware, deleteVideo);

router.post("/:id/like", authMiddleware, likeVideo);

router.post("/:id/dislike", authMiddleware, dislikeVideo);

export default router;