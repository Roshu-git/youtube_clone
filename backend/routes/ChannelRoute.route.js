import express from "express";

import {
  createChannel,
  getChannelById,
  getMyChannel,
  updateChannel,
} from "../controllers/channel.controller.js";

import authMiddleware from "../middleware/auth.middleware.js";

const router = express.Router();

// Create channel
router.post("/", authMiddleware, createChannel);

// Get logged-in user's channel
// IMPORTANT: This must come BEFORE /:id
router.get("/my", authMiddleware, getMyChannel);

// Get channel by ID
router.get("/:id", getChannelById);

// Update channel
router.put("/:id", authMiddleware, updateChannel);

export default router;