import mongoose, { Schema } from "mongoose";

const userSchema = new Schema({
  username: {
    type: String,
    unique: true,
    trim: true,
    lowercase: true,
    index: true,
    required: true,
  },
  Fullname: {
    type: String,
    trim: true,
    lowercase: true,
    index: true,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    trim: true,
    lowercase: true,
    required: true,
  },
  avatar: {
    type: String,
    unique: true,
    trim: true,
    lowercase: true,
    required: true,
  },
  coverImage: {
    type: String,
    unique: true,
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    unique: true,
    lowercase: true,
    required: [true, "Password is required"],
  },
  refreshToken: {
    type: String,
    unique: true,
  },
  watchHistory: [{
    type: Schema.Types.ObjectId,
    ref: "video",
  }],
});

const User = mongoose.model("User", userSchema);

export default User;
