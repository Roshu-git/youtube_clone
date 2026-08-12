const express = require("express");

const Video = require("../models/Video.model");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();


// ======================================
// GET ALL VIDEOS
// ======================================

router.get("/", async (req, res) => {
  try {

    const videos = await Video.find()
      .populate("channel", "channelName")
      .populate("uploader", "username");

    res.json(videos);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Server error"
    });

  }
});


// ======================================
// GET SINGLE VIDEO
// ======================================

router.get("/:id", async (req, res) => {
  try {

    const video = await Video.findById(req.params.id)
      .populate("channel", "channelName")
      .populate("uploader", "username");

    if (!video) {
      return res.status(404).json({
        message: "Video not found"
      });
    }

    res.json(video);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Server error"
    });

  }
});


// ======================================
// CREATE VIDEO
// ======================================

router.post("/", authMiddleware, async (req, res) => {
  try {

    const {
      title,
      description,
      videoUrl,
      thumbnailUrl,
      category,
      channel
    } = req.body;

    if (
      !title ||
      !videoUrl ||
      !thumbnailUrl ||
      !category ||
      !channel
    ) {
      return res.status(400).json({
        message: "Required fields are missing"
      });
    }

    const video = await Video.create({
      title,
      description,
      videoUrl,
      thumbnailUrl,
      category,
      channel,
      uploader: req.user.userId
    });

    res.status(201).json({
      message: "Video created successfully",
      video
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Server error"
    });

  }
});


// ======================================
// UPDATE VIDEO
// ======================================

router.put("/:id", authMiddleware, async (req, res) => {
  try {

    const video = await Video.findById(req.params.id);

    if (!video) {
      return res.status(404).json({
        message: "Video not found"
      });
    }

    if (
      video.uploader.toString() !==
      req.user.userId
    ) {
      return res.status(403).json({
        message: "You are not allowed to update this video"
      });
    }

    const updatedVideo = await Video.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    res.json({
      message: "Video updated successfully",
      video: updatedVideo
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Server error"
    });

  }
});


// ======================================
// DELETE VIDEO
// ======================================

router.delete("/:id", authMiddleware, async (req, res) => {
  try {

    const video = await Video.findById(req.params.id);

    if (!video) {
      return res.status(404).json({
        message: "Video not found"
      });
    }

    if (
      video.uploader.toString() !==
      req.user.userId
    ) {
      return res.status(403).json({
        message: "You are not allowed to delete this video"
      });
    }

    await Video.findByIdAndDelete(req.params.id);

    res.json({
      message: "Video deleted successfully"
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Server error"
    });

  }
});

module.exports = router;