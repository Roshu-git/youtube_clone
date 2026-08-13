import mongoose from "mongoose";
import Video from "../models/Video.model.js";
import Channel from "../models/Channel.model.js";

// =============================
// GET ALL VIDEOS
// Supports:
// ?search=react
// ?category=Gaming
// ?channelId=xxxxx
// =============================
export const getVideos = async (req, res) => {
  try {
    const {
      search,
      category,
      channelId,
    } = req.query;

    const filter = {};

    // Search by title
    if (search && search.trim()) {
      filter.title = {
        $regex: search.trim(),
        $options: "i",
      };
    }

    // Category filter
    if (
      category &&
      category !== "All"
    ) {
      filter.category = category;
    }

    // Channel filter
    if (channelId) {
      filter.channelId = channelId;
    }

    const videos = await Video.find(filter)
      .populate(
        "uploader",
        "username avatar"
      )
      .populate(
        "channelId",
        "channelName channelBanner subscribers"
      )
      .sort({
        createdAt: -1,
      });

    return res.status(200).json({
      count: videos.length,
      videos,
    });

  } catch (error) {

    console.error(
      "GET VIDEOS ERROR:",
      error
    );

    return res.status(500).json({
      message: "Failed to fetch videos",
    });
  }
};

// =============================
// GET SINGLE VIDEO
// GET /api/videos/:id
// =============================
export const getVideoById = async (
  req,
  res
) => {

  try {

    const { id } = req.params;

    console.log(
      "GET VIDEO ID:",
      id
    );

    // Check missing ID
    if (!id) {

      return res.status(400).json({
        message: "Video ID is missing",
      });
    }

    // Check valid MongoDB ObjectId
    if (
      !mongoose.Types.ObjectId.isValid(id)
    ) {

      return res.status(400).json({
        message: "Invalid video ID",
      });
    }

    const video =
      await Video.findById(id)
        .populate(
          "uploader",
          "username avatar"
        )
        .populate(
          "channelId",
          "channelName channelBanner subscribers"
        );

    if (!video) {

      return res.status(404).json({
        message: "Video not found",
      });
    }

    return res.status(200).json({
      video,
    });

  } catch (error) {

    console.error(
      "GET VIDEO ERROR:",
      error
    );

    return res.status(500).json({
      message: "Failed to fetch video",
      error: error.message,
    });
  }
};

// =============================
// CREATE VIDEO
// POST /api/videos
// =============================
export const createVideo = async (
  req,
  res
) => {

  try {

    const {
      title,
      description,
      videoUrl,
      thumbnailUrl,
      category,
      channelId,
    } = req.body;

    if (
      !title ||
      !videoUrl ||
      !thumbnailUrl ||
      !category ||
      !channelId
    ) {

      return res.status(400).json({
        message:
          "Title, video URL, thumbnail URL, category and channel are required",
      });
    }

    // Validate channel ID
    if (
      !mongoose.Types.ObjectId.isValid(
        channelId
      )
    ) {

      return res.status(400).json({
        message: "Invalid channel ID",
      });
    }

    // Verify channel exists
    const channel =
      await Channel.findById(channelId);

    if (!channel) {

      return res.status(404).json({
        message: "Channel not found",
      });
    }

    // Verify logged-in user owns channel
    if (
      channel.owner.toString() !==
      req.user.id
    ) {

      return res.status(403).json({
        message:
          "You can only upload videos to your own channel",
      });
    }

    const video =
      await Video.create({
        title: title.trim(),
        description:
          description?.trim() || "",
        videoUrl: videoUrl.trim(),
        thumbnailUrl:
          thumbnailUrl.trim(),
        category: category.trim(),
        channelId,
        uploader: req.user.id,
      });

    // Add video to channel
    channel.videos.push(
      video._id
    );

    await channel.save();

    const populatedVideo =
      await Video.findById(
        video._id
      )
        .populate(
          "uploader",
          "username avatar"
        )
        .populate(
          "channelId",
          "channelName channelBanner subscribers"
        );

    return res.status(201).json({
      message:
        "Video created successfully",
      video: populatedVideo,
    });

  } catch (error) {

    console.error(
      "CREATE VIDEO ERROR:",
      error
    );

    return res.status(500).json({
      message: "Failed to create video",
      error: error.message,
    });
  }
};

// =============================
// UPDATE VIDEO
// PUT /api/videos/:id
// =============================
export const updateVideo = async (
  req,
  res
) => {

  try {

    const { id } = req.params;

    if (
      !mongoose.Types.ObjectId.isValid(id)
    ) {

      return res.status(400).json({
        message: "Invalid video ID",
      });
    }

    const video =
      await Video.findById(id);

    if (!video) {

      return res.status(404).json({
        message: "Video not found",
      });
    }

    // Only uploader can edit
    if (
      video.uploader.toString() !==
      req.user.id
    ) {

      return res.status(403).json({
        message:
          "You can only edit your own videos",
      });
    }

    const {
      title,
      description,
      videoUrl,
      thumbnailUrl,
      category,
    } = req.body;

    if (title !== undefined) {
      video.title =
        title.trim();
    }

    if (
      description !== undefined
    ) {
      video.description =
        description.trim();
    }

    if (
      videoUrl !== undefined
    ) {
      video.videoUrl =
        videoUrl.trim();
    }

    if (
      thumbnailUrl !== undefined
    ) {
      video.thumbnailUrl =
        thumbnailUrl.trim();
    }

    if (
      category !== undefined
    ) {
      video.category =
        category.trim();
    }

    await video.save();

    const updatedVideo =
      await Video.findById(
        video._id
      )
        .populate(
          "uploader",
          "username avatar"
        )
        .populate(
          "channelId",
          "channelName channelBanner subscribers"
        );

    return res.status(200).json({
      message:
        "Video updated successfully",
      video: updatedVideo,
    });

  } catch (error) {

    console.error(
      "UPDATE VIDEO ERROR:",
      error
    );

    return res.status(500).json({
      message: "Failed to update video",
      error: error.message,
    });
  }
};

// =============================
// DELETE VIDEO
// DELETE /api/videos/:id
// =============================
export const deleteVideo = async (
  req,
  res
) => {

  try {

    const { id } = req.params;

    if (
      !mongoose.Types.ObjectId.isValid(id)
    ) {

      return res.status(400).json({
        message: "Invalid video ID",
      });
    }

    const video =
      await Video.findById(id);

    if (!video) {

      return res.status(404).json({
        message: "Video not found",
      });
    }

    // Only uploader can delete
    if (
      video.uploader.toString() !==
      req.user.id
    ) {

      return res.status(403).json({
        message:
          "You can only delete your own videos",
      });
    }

    // Remove video from channel
    await Channel.findByIdAndUpdate(
      video.channelId,
      {
        $pull: {
          videos: video._id,
        },
      }
    );

    // Delete video
    await Video.findByIdAndDelete(
      id
    );

    return res.status(200).json({
      message:
        "Video deleted successfully",
    });

  } catch (error) {

    console.error(
      "DELETE VIDEO ERROR:",
      error
    );

    return res.status(500).json({
      message: "Failed to delete video",
      error: error.message,
    });
  }
};

// =============================
// LIKE VIDEO
// POST /api/videos/:id/like
// =============================
export const likeVideo = async (
  req,
  res
) => {

  try {

    const { id } = req.params;

    if (
      !mongoose.Types.ObjectId.isValid(id)
    ) {

      return res.status(400).json({
        message: "Invalid video ID",
      });
    }

    const video =
      await Video.findById(id);

    if (!video) {

      return res.status(404).json({
        message: "Video not found",
      });
    }

    const userId =
      req.user.id;

    const alreadyLiked =
      video.likes.some(
        (user) =>
          user.toString() ===
          userId
      );

    if (alreadyLiked) {

      // Unlike
      video.likes.pull(
        userId
      );

    } else {

      // Like
      video.likes.addToSet(
        userId
      );

      // Remove dislike
      video.dislikes.pull(
        userId
      );
    }

    await video.save();

    return res.status(200).json({
      message: alreadyLiked
        ? "Video unliked"
        : "Video liked",

      likes:
        video.likes.length,

      dislikes:
        video.dislikes.length,
    });

  } catch (error) {

    console.error(
      "LIKE VIDEO ERROR:",
      error
    );

    return res.status(500).json({
      message:
        "Failed to like video",
      error: error.message,
    });
  }
};

// =============================
// DISLIKE VIDEO
// POST /api/videos/:id/dislike
// =============================
export const dislikeVideo = async (
  req,
  res
) => {

  try {

    const { id } = req.params;

    if (
      !mongoose.Types.ObjectId.isValid(id)
    ) {

      return res.status(400).json({
        message: "Invalid video ID",
      });
    }

    const video =
      await Video.findById(id);

    if (!video) {

      return res.status(404).json({
        message: "Video not found",
      });
    }

    const userId =
      req.user.id;

    const alreadyDisliked =
      video.dislikes.some(
        (user) =>
          user.toString() ===
          userId
      );

    if (alreadyDisliked) {

      // Remove dislike
      video.dislikes.pull(
        userId
      );

    } else {

      // Add dislike
      video.dislikes.addToSet(
        userId
      );

      // Remove like
      video.likes.pull(
        userId
      );
    }

    await video.save();

    return res.status(200).json({
      message: alreadyDisliked
        ? "Dislike removed"
        : "Video disliked",

      likes:
        video.likes.length,

      dislikes:
        video.dislikes.length,
    });

  } catch (error) {

    console.error(
      "DISLIKE VIDEO ERROR:",
      error
    );

    return res.status(500).json({
      message:
        "Failed to dislike video",
      error: error.message,
    });
  }
};