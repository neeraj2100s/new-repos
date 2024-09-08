import mongoose, { Schema } from "mongoose"; // Mongoose aur Schema ko import kar rahe hain
import jwt from "jsonwebtoken"; // JWT (JSON Web Token) ko import kar rahe hain
import bcrypt from "bcrypt"; // Bcrypt ko import kar rahe hain, jo password ko hash karne ke liye use hota hai

// User ka schema define kar rahe hain
const userSchema = new Schema({
  username: {
    type: String,
    unique: true, // Unique hona chahiye
    trim: true, // Extra spaces hata raha hai
    lowercase: true, // Lowercase mein convert kar raha hai
    index: true, // Index banane ke liye
    required: true, // Required field hai
  },
  fullname: {
    type: String,
    trim: true, // Extra spaces hata raha hai
    lowercase: true, // Lowercase mein convert kar raha hai
    index: true, // Index banane ke liye
    required: true, // Required field hai
  },
  email: {
    type: String,
    unique: true, // Unique hona chahiye
    trim: true, // Extra spaces hata raha hai
    lowercase: true, // Lowercase mein convert kar raha hai
    required: true, // Required field hai
  },
  avatar: {
    type: String,
    // Extra spaces hata raha hai
    lowercase: true, // Lowercase mein convert kar raha hai
    required: true, // Required field hai
  },
  coverImage: {
    type: String,
    lowercase: true, // Lowercase mein convert kar raha hai
  },
  password: {
    type: String,
    unique: true, // Unique hona chahiye
    lowercase: true, // Lowercase mein convert kar raha hai
    required: [true, "Password is required"], // Password required hai
  },
  refreshToken: {
    type: String,
    unique: true, // Unique hona chahiye
  },
  watchHistory: [{
    type: Schema.Types.ObjectId, // ObjectId type ka array hai
    ref: "video", // Video collection se reference hai
  }]
}, {
  timestamps: true // Timestamps automatically add ho jayenge (createdAt, updatedAt)
});

// Password save karne se pehle hash kar raha hai
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next(); // Agar password modify nahi hua toh aage badh jao
  this.password = await bcrypt.hash(this.password, 10); // Password ko hash kar rahe hain
  next(); // Next middleware ko call kar raha hai
});

// Password compare karne ka method bana rahe hain
userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password); // Bcrypt se password compare kar rahe hain
};
///
// Access token generate karne ka method
userSchema.methods.generateAccessToken = function () {
  return jwt.sign({
    _id: this._id,
    email: this.email,
    username: this.username,
    fullname: this.fullname // Corrected property name
  },
    process.env.ACCESS_TOKEN_SECRET, // Secret key environment variable se le rahe hain
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY // Expiry time environment variable se le rahe hain
    }
  );
};

// Refresh token generate karne ka method
userSchema.methods.generateRefreshToken = function () {
  return jwt.sign({
    _id: this._id,
  },
    process.env.REFRESH_TOKEN_SECRET, // Secret key environment variable se le rahe hain
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY // Expiry time environment variable se le rahe hain
    }
  );
};

// User model create kar rahe hain
const User = mongoose.model("User", userSchema);

export default User; // User model ko export kar rahe hain
