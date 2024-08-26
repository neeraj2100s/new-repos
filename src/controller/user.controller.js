// user.controller.js
import { asyncHandler } from "../utils/aysncHandller.js";  // Importing asyncHandler to handle async errors

// User registration ka async function define karte hain
const registerUser = asyncHandler(async (req, res) => {
    // Registration logic yahan likha jayega
    res.status(200).json({
        message: "User registered successfully"  // Successful registration message
    });
});

// registerUser function ko export karte hain taaki routes file me use ho sake
export { registerUser };
