import Channel from "../models/Channel.model.js";
import User from "../models/User.model.js";

// =============================
// CREATE CHANNEL
// =============================
export const createChannel = async (req, res) => {
  try {
    const {
      channelName,
      description,
      channelBanner,
    } = req.body;

    if (!channelName || !channelName.trim()) {
      return res.status(400).json({
        message: "Channel name is required",
      });
    }

    // Owner comes from JWT
    const ownerId = req.user.id;

    const user = await User.findById(ownerId);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const existingChannel = await Channel.findOne({
      channelName: channelName.trim(),
    });

    if (existingChannel) {
      return res.status(409).json({
        message: "Channel name already exists",
      });
    }

    const channel = await Channel.create({
      channelName: channelName.trim(),
      owner: ownerId,
      description: description?.trim() || "",
      channelBanner: channelBanner?.trim() || "",
    });

    // Add channel to user's channels
    if (!user.channels) {
      user.channels = [];
    }

    user.channels.push(channel._id);

    await user.save();

    const populatedChannel =
      await Channel.findById(channel._id)
        .populate("owner", "username email avatar")
        .populate("videos");

    return res.status(201).json({
      message: "Channel created successfully",
      channel: populatedChannel,
    });

  } catch (error) {
    console.error("CREATE CHANNEL ERROR:", error);

    return res.status(500).json({
      message: "Failed to create channel",
      error: error.message,
    });
  }
};


// =============================
// GET MY CHANNEL
// =============================
export const getMyChannel = async (req, res) => {
  try {
    const userId = req.user.id;

    console.log("GET MY CHANNEL USER:", userId);

    const channel = await Channel.findOne({
      owner: userId,
    })
        console.log("FOUND CHANNEL:", channel);

    //   .populate("owner", "username email avatar")
    //   .populate("videos");

    if (!channel) {
      return res.status(404).json({
        message: "You have not created a channel yet.",
      });
    }

    const populatedChannel = await Channel.findById(channel._id)
      .populate("owner", "username email avatar")
      .populate("videos");

    console.log("RETURNING CHANNEL:", populatedChannel);

    return res.status(200).json({
      channel: populatedChannel,
    });
    
  } catch (error) {
    console.error("GET MY CHANNEL ERROR:", error);

    return res.status(500).json({
      message: "Failed to fetch your channel",
      error: error.message,
    });
  }
};


// =============================
// GET CHANNEL BY ID
// =============================
export const getChannelById = async (req, res) => {
  try {
    const { id } = req.params;

    const channel = await Channel.findById(id)
      .populate("owner", "username email avatar")
      .populate("videos");

    if (!channel) {
      return res.status(404).json({
        message: "Channel not found",
      });
    }

    return res.status(200).json({
      channel,
    });

  } catch (error) {
    console.error("GET CHANNEL ERROR:", error);

    return res.status(500).json({
      message: "Failed to fetch channel",
      error: error.message,
    });
  }
};


// =============================
// UPDATE CHANNEL
// =============================
export const updateChannel = async (req, res) => {
  try {
    const { id } = req.params;

    const channel = await Channel.findById(id);

    if (!channel) {
      return res.status(404).json({
        message: "Channel not found",
      });
    }

    // Only owner can update
    if (channel.owner.toString() !== req.user.id) {
      return res.status(403).json({
        message: "You can only edit your own channel",
      });
    }

    const {
      channelName,
      description,
      channelBanner,
    } = req.body;

    if (channelName !== undefined) {
      channel.channelName = channelName.trim();
    }

    if (description !== undefined) {
      channel.description = description.trim();
    }

    if (channelBanner !== undefined) {
      channel.channelBanner = channelBanner.trim();
    }

    await channel.save();

    const updatedChannel =
      await Channel.findById(channel._id)
        .populate("owner", "username email avatar")
        .populate("videos");

    return res.status(200).json({
      message: "Channel updated successfully",
      channel: updatedChannel,
    });

  } catch (error) {
    console.error("UPDATE CHANNEL ERROR:", error);

    return res.status(500).json({
      message: "Failed to update channel",
      error: error.message,
    });
  }
};