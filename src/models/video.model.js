import mongoose, { Schema } from "mongoose";

const videoSchema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    index: true,
  },
  description: {
    type: String,
    trim: true,
    lowercase: true,
  },
  url: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  thumbnail: {
    type: String,
    trim: true,
  },
  duration: {
    type: Number,
    required: true,
  },
  uploadDate: {
    type: Date,
    default: Date.now,
  },
  views: {
    type: Number,
    default: 0,
  },
  likes: {
    type: Number,
    default: 0,
  },
  dislikes: {
    type: Number,
    default: 0,
  },
  comments: [{
    type: Schema.Types.ObjectId,
    ref: "comment",
  }],
  uploader: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

const Video = mongoose.model("Video", videoSchema);

export default Video;
