const express = require("express");

const Channel = require("../models/Channel.model");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();


// ======================================
// CREATE CHANNEL
// ======================================

router.post("/", authMiddleware, async (req, res) => {
  try {

    const {
      channelName,
      description,
      channelBanner
    } = req.body;

    if (!channelName) {
      return res.status(400).json({
        message: "Channel name is required"
      });
    }

    const channel = await Channel.create({
      channelName,
      description,
      channelBanner,
      owner: req.user.userId
    });

    res.status(201).json({
      message: "Channel created successfully",
      channel
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Server error"
    });

  }
});

//get channels
// GET all channels
router.get("/", async (req, res) => {
  try {
    const channels = await Channel.find();

    res.status(200).json(channels);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server error"
    });
  }
});
// ======================================
// GET CHANNEL by id
// ======================================

router.get("/:id", async (req, res) => {
  try {

    const channel = await Channel.findById(req.params.id)
      .populate("owner", "username email")
      .populate("videos");

    if (!channel) {
      return res.status(404).json({
        message: "Channel not found"
      });
    }

    res.json(channel);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Server error"
    });

  }
});

module.exports = router;