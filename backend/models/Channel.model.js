import mongoose from "mongoose";

const channelSchema = new mongoose.Schema(
  {
    channelName: {
      type: String,
      required: [true, "Channel name is required"],
      trim: true,
      minlength: [3, "Channel name must be at least 3 characters"],
      maxlength: [50, "Channel name cannot exceed 50 characters"]
    },

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Channel owner is required"]
    },

    description: {
      type: String,
      default: "",
      trim: true,
      maxlength: [500, "Description cannot exceed 500 characters"]
    },

    channelBanner: {
      type: String,
      default: "",
      trim: true
    },

    subscribers: {
      type: Number,
      default: 0,
      min: 0
    },

    videos: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Video"
      }
    ]
  },
  {
    timestamps: true
  }
);

export default mongoose.model("Channel", channelSchema);