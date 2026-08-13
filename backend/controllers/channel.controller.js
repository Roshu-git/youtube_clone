import Channel from "../models/Channel.model.js";
import User from "../models/User.model.js";

// =====================================================
// CREATE CHANNEL
// POST /api/channels
// =====================================================
export const createChannel = async (req, res) => {
  try {
    const {
      channelName,
      description,
      channelBanner,
    } = req.body;

    // -----------------------------------------------
    // Validate channel name
    // -----------------------------------------------
    if (!channelName || !channelName.trim()) {
      return res.status(400).json({
        message: "Channel name is required",
      });
    }

    // -----------------------------------------------
    // Get logged-in user from JWT
    // -----------------------------------------------
    const ownerId = req.user.id;

    console.log("CREATE CHANNEL USER:", ownerId);

    // -----------------------------------------------
    // Check user exists
    // -----------------------------------------------
    const user = await User.findById(ownerId);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // -----------------------------------------------
    // Check if user already has a channel
    // -----------------------------------------------
    const userChannel = await Channel.findOne({
      owner: ownerId,
    });

    if (userChannel) {
      return res.status(409).json({
        message: "You already have a channel",
        channel: userChannel,
      });
    }

    // -----------------------------------------------
    // Check duplicate channel name
    // -----------------------------------------------
    const existingChannel = await Channel.findOne({
      channelName: channelName.trim(),
    });

    if (existingChannel) {
      return res.status(409).json({
        message: "Channel name already exists",
      });
    }

    // -----------------------------------------------
    // Create channel
    // -----------------------------------------------
    const channel = await Channel.create({
      channelName: channelName.trim(),
      owner: ownerId,
      description: description?.trim() || "",
      channelBanner: channelBanner?.trim() || "",
    });

    console.log("CHANNEL CREATED:", channel._id);

    // -----------------------------------------------
    // Add channel to user's channels array
    // -----------------------------------------------
    if (!user.channels) {
      user.channels = [];
    }

    // Prevent duplicate channel ID
    const alreadyAdded = user.channels.some(
      (id) => id.toString() === channel._id.toString()
    );

    if (!alreadyAdded) {
      user.channels.push(channel._id);
      await user.save();
    }

    // -----------------------------------------------
    // Populate channel
    // -----------------------------------------------
    const populatedChannel =
      await Channel.findById(channel._id)
        .populate("owner", "username email avatar")
        .populate("videos");

    // -----------------------------------------------
    // Response
    // -----------------------------------------------
    return res.status(201).json({
      message: "Channel created successfully",
      hasChannel: true,
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


// =====================================================
// GET MY CHANNEL
// GET /api/channels/my
// =====================================================
export const getMyChannel = async (req, res) => {
  try {
    // -----------------------------------------------
    // Get logged-in user ID
    // -----------------------------------------------
    const userId = req.user.id;

    console.log("=================================");
    console.log("GET MY CHANNEL");
    console.log("USER ID:", userId);
    console.log("=================================");

    // -----------------------------------------------
    // Find channel owned by current user
    // -----------------------------------------------
    const channel = await Channel.findOne({
      owner: userId,
    })
      .populate("owner", "username email avatar")
      .populate("videos");

    console.log("FOUND CHANNEL:", channel);

    // -----------------------------------------------
    // User does NOT have a channel
    // -----------------------------------------------
    if (!channel) {
      console.log(
        "NO CHANNEL FOUND FOR USER:",
        userId
      );

      return res.status(200).json({
        message: "You have not created a channel yet.",
        hasChannel: false,
        channel: null,
      });
    }

    // -----------------------------------------------
    // User HAS a channel
    // -----------------------------------------------
    console.log(
      "CHANNEL FOUND:",
      channel._id
    );

    return res.status(200).json({
      message: "Channel fetched successfully",
      hasChannel: true,
      channel,
    });

  } catch (error) {
    console.error(
      "GET MY CHANNEL ERROR:",
      error
    );

    return res.status(500).json({
      message: "Failed to fetch your channel",
      error: error.message,
    });
  }
};


// =====================================================
// GET CHANNEL BY ID
// GET /api/channels/:id
// =====================================================
export const getChannelById = async (req, res) => {
  try {
    const { id } = req.params;

    // -----------------------------------------------
    // Find channel
    // -----------------------------------------------
    const channel = await Channel.findById(id)
      .populate("owner", "username email avatar")
      .populate("videos");

    // -----------------------------------------------
    // Channel not found
    // -----------------------------------------------
    if (!channel) {
      return res.status(404).json({
        message: "Channel not found",
        channel: null,
      });
    }

    // -----------------------------------------------
    // Success
    // -----------------------------------------------
    return res.status(200).json({
      message: "Channel fetched successfully",
      channel,
    });

  } catch (error) {
    console.error(
      "GET CHANNEL BY ID ERROR:",
      error
    );

    return res.status(500).json({
      message: "Failed to fetch channel",
      error: error.message,
    });
  }
};


// =====================================================
// UPDATE CHANNEL
// PUT /api/channels/:id
// =====================================================
export const updateChannel = async (req, res) => {
  try {
    const { id } = req.params;

    // -----------------------------------------------
    // Find channel
    // -----------------------------------------------
    const channel = await Channel.findById(id);

    if (!channel) {
      return res.status(404).json({
        message: "Channel not found",
      });
    }

    // -----------------------------------------------
    // Check owner
    // -----------------------------------------------
    if (
      channel.owner.toString() !==
      req.user.id.toString()
    ) {
      return res.status(403).json({
        message:
          "You can only edit your own channel",
      });
    }

    const {
      channelName,
      description,
      channelBanner,
    } = req.body;

    // -----------------------------------------------
    // Update channel name
    // -----------------------------------------------
    if (channelName !== undefined) {
      if (!channelName.trim()) {
        return res.status(400).json({
          message:
            "Channel name cannot be empty",
        });
      }

      // Check if another channel uses this name
      const duplicateChannel =
        await Channel.findOne({
          channelName: channelName.trim(),
          _id: { $ne: id },
        });

      if (duplicateChannel) {
        return res.status(409).json({
          message:
            "Channel name already exists",
        });
      }

      channel.channelName =
        channelName.trim();
    }

    // -----------------------------------------------
    // Update description
    // -----------------------------------------------
    if (description !== undefined) {
      channel.description =
        description.trim();
    }

    // -----------------------------------------------
    // Update banner
    // -----------------------------------------------
    if (channelBanner !== undefined) {
      channel.channelBanner =
        channelBanner.trim();
    }

    // -----------------------------------------------
    // Save changes
    // -----------------------------------------------
    await channel.save();

    // -----------------------------------------------
    // Get updated channel
    // -----------------------------------------------
    const updatedChannel =
      await Channel.findById(channel._id)
        .populate(
          "owner",
          "username email avatar"
        )
        .populate("videos");

    // -----------------------------------------------
    // Response
    // -----------------------------------------------
    return res.status(200).json({
      message:
        "Channel updated successfully",
      channel: updatedChannel,
    });

  } catch (error) {
    console.error(
      "UPDATE CHANNEL ERROR:",
      error
    );

    return res.status(500).json({
      message: "Failed to update channel",
      error: error.message,
    });
  }
};