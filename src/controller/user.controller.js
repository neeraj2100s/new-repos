import asyncHandler from "../utils/aysncHandller.js";
// yeh asyncHandler function ko import karta hai jo async errors ko handle karne me madad karta hai taaki try-catch block likhne ki zarurat na pade.

import ApiError  from "../utils/ApiError.js"; 
// ApiError class ko import kiya gaya hai jo custom error messages generate karne me madad karta hai, jaise ki 400 Bad Request ya 409 Conflict.

import ApiResponse from "../utils/ApiResposne.js";
// ApiResponse utility ko import kiya gaya hai jo standardized API responses dene me madad karta hai.

import  uploadOnCloudinary from "../utils/coudynari.js";  
// yeh function ko import karta hai jo files ko Cloudinary pe upload karne ka kaam karta hai.

import User from "../models/user-model.js";  
// yeh User model ko import karta hai jo MongoDB database me users ki information save aur manage karta hai.

import verifyJWT from "../middlewares/auth.middleware.js";
const generateAccessAndRefreshTokens = async (userId) => {
    try {
        const user = await User.findById(userId);
        // yeh line user ko database se uski ID ke basis pe find karti hai.

        const accessToken = user.generateAccessToken();
        // yeh user ke liye access token generate karta hai.

        const refreshToken = user.generateRefreshToken();
        // yeh refresh token generate karta hai jo future me use hoga token renew karne ke liye.

        user.refreshToken = refreshToken;
        // refresh token ko user ke document me save karta hai.

        await user.save({ validateBeforeSave: true });
        // yeh user document ko save karta hai database me with refresh token.

        return { accessToken, refreshToken };
        // yeh access token aur refresh token return karta hai.

    } catch (error) {
        throw new ApiError(500, "Something went wrong");
        // Agar koi error aata hai toh 500 Internal Server Error throw karta hai.
    }
};

// User registration ka async function define karte hain
const registerUser = asyncHandler(async (req, res) => {
    // registerUser naam ka ek async function banaya gaya hai jo user registration ke liye hai. asyncHandler isse async errors se protect karta hai.

    const { username, fullname, email, password } = req.body;
    // Yeh line req.body se user ke input fields ko destructure karke variables me store kar rahi hai.

    // Check if any required field is missing
    if ([fullname, email, username, password].some((field) => field?.trim() === "")) {
        throw new ApiError(400, "All fields are required");
        // Yeh check karta hai ki koi bhi required field (fullname, email, username, password) blank toh nahi hai. Agar blank hai, toh 400 error throw hota hai.
    }

    // Check if user already exists
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
        throw new ApiError(409, "User already exists with this username or email");
        // Yeh database me check karta hai ki user already exist toh nahi karta with same email ya username. Agar karta hai, toh 409 Conflict error throw hota hai.
    }

    // Extract local file paths for avatar and cover image
    const avatarLocalFile = req.files?.avatar?.[0]?.path;
    const coverImageLocalPath = req.files?.coverImage?.[0]?.path;
    // Yeh user ke uploaded avatar aur cover image files ke local paths ko extract karta hai. Agar files upload hui hain toh unke path yeh variables me store ho jayenge.

    if (!avatarLocalFile) {
        throw new ApiError(400, "Avatar file is required");
        // Yeh check karta hai ki avatar file upload hui hai ya nahi. Agar nahi hui, toh 400 error throw hota hai.
    }

    // Upload files to Cloudinary
    const avatar = await uploadOnCloudinary(avatarLocalFile);
    const coverImage = await uploadOnCloudinary(coverImageLocalPath);
    // Yeh avatar aur cover image files ko Cloudinary pe upload karta hai. Upload hone ke baad jo URL milta hai wo 'avatar' aur 'coverImage' variables me store hota hai.

    if (!avatar) {
        throw new ApiError(400, "Failed to upload avatar file");
        // Yeh check karta hai ki avatar file Cloudinary pe upload hui ya nahi. Agar nahi hui, toh 400 error throw hota hai.
    }

    console.log(req.files);
    // Yeh line request ke files object ko console me log kar rahi hai. Debugging ke liye helpful ho sakti hai.

    // Create a new user
    const newUser = await User.create({
        fullname,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email,
        password,
        username: username.toLowerCase()
    });
    // Yeh naya user create karne ka code hai. Database me user ki details store hoti hain jaise fullname, avatar URL, cover image URL, email, password, aur lowercase me username.

    // Send a successful response
    res.status(201).json({ message: "User registered successfully", user: newUser });
    // Agar sab kuch sahi se ho jata hai, toh yeh client ko 201 status code ke saath success message return karta hai aur naye user ki details bhi return karta hai.
});

const loginUser = asyncHandler(async (req, res) => {
    // loginUser function user ko authenticate aur login karne ke liye banaya gaya hai.

    const { email, username, password } = req.body;
    // User ke input (email, username, aur password) ko destructure karke variables me store karte hain.

    if (!username || !email) {
        throw new ApiError(400, "Username and password are required");
        // Agar username ya email nahi diya gaya hai toh 400 Bad Request error throw hota hai.
    }

    const user = await User.findOne({
        $or: [{ username }, { email }]
    });
    // Database me check karte hain ki user exist karta hai ya nahi by either username ya email.

    if (!user) {
        throw new ApiError(404, "User does not exist");
        // Agar user exist nahi karta toh 404 Not Found error throw hota hai.
    }

    // Password checking
    const isPasswordValid = await user.isPasswordCorrect(password);
    // User ke password ko check karte hain ki valid hai ya nahi.

    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid user credentials");
        // Agar password match nahi hota toh 401 Unauthorized error throw hota hai.
    }

    const { refreshToken, accessToken } = await generateAccessAndRefreshTokens(user._id);
    // Access token aur refresh token generate karte hain user ke liye.

    // Send it to cookies
    const loggedInUser = await User.findById(user._id).select("-password -refreshToken");
    // User ko retrieve karte hain without password aur refreshToken fields ke, taaki response me sensitive data na jaye.

    const options = {
        httpOnly: true,
        secure: true
    };
    // Cookies ke liye options set karte hain, jisme httpOnly aur secure flag set hota hai.

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(200, { user: loggedInUser, accessToken, refreshToken }, "User logged in successfully")
        );
    // Agar sab sahi hai toh 200 status code ke saath cookies set karte hain aur response me user data aur tokens return karte hain.
});

const logOutUser = asyncHandler(async (req, res) => {
    // logOutUser function user ko logout karne ke liye banaya gaya hai.

    await User.findByIdAndUpdate(req.user._id, {
        $set: { refreshToken: undefined },
        new: true
    });
    // User ke document me refreshToken ko undefined set karte hain taaki token invalidate ho jaye.

    const options = {
        httpOnly: true,
        secure: true
    };
    // Cookies ke liye options set karte hain, jisme httpOnly aur secure flag set hota hai.

    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(new ApiResponse(200, {}, "User logged out successfully"));
    // Cookies ko clear karte hain aur 200 status code ke saath success message return karte hain.
});

// registerUser, loginUser, aur logOutUser functions ko export karte hain taaki routes file me use ho sake.
export {
    registerUser,
    loginUser,
    logOutUser
};
