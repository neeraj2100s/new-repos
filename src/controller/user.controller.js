// src/controller/user.controller.js
import asyncHandler from "../utils/aysncHandller.js";  // Default import
import { ApiError } from "../utils/ApiError.js";
import {uploadOnCloudinary} from "../utils/coudynari.js"; // Correct import of uploadOnCloudinary
import User from "../models/user-model.js"; // Importing the User model

// User registration ka async function define karte hain
const registerUser = asyncHandler(async (req, res) => {

    const { username, fullname, email, password } = req.body;

    // Check if any required field is missing
    if ([fullname, email, username, password].some((field) => field?.trim() === "")) {
        throw new ApiError(400, "All fields are required");
    }

    // Check if user already exists
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
        throw new ApiError(409, "User already exists with this username or email");
    }

    // Extract local file paths for avatar and cover image
    const avatarLocalFile = req.files?.avatar?.[0]?.path;
    const coverImageLocalPath = req.files?.coverImage?.[0]?.path;

    if (!avatarLocalFile) {
        throw new ApiError(400, "Avatar file is required");
    }

    // Upload files to Cloudinary
    const avatar = await uploadOnCloudinary(avatarLocalFile);
    const coverImage = await uploadOnCloudinary(coverImageLocalPath);

    if (!avatar) {
        throw new ApiError(400, "Failed to upload avatar file");
    }

    // Create a new user
    const newUser = await User.create({
        fullname,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email,
        password,
        username: username.toLowerCase()
    });

    // Send a successful response
    res.status(201).json({ message: "User registered successfully", user: newUser });
});

// registerUser function ko export karte hain taaki routes file me use ho sake
export { registerUser };
