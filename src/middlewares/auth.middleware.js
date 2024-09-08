import asyncHandler from "../utils/aysncHandller.js";
import  ApiError from "../utils/ApiError.js"; // ApiError ko import karte hain jo custom error messages banane mein madad karta hai.

 const verifyJWT = asyncHandler(async (req, res, next) => { 
    // verifyJWT ek middleware function hai jo JWT token ko verify karega.

    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer", ""); 
        // Pehle check karte hain ki token 'cookies' me hai ya 'Authorization' header me. Agar header me hai to "Bearer" word ko hata ke sirf token nikalte hain.

        if (!token) { 
            throw new ApiError(401, "Unauthorized request"); 
            // Agar token nahi milta, to 401 Unauthorized error throw karte hain.
        }

        const decodedToken = jwt.verifyJWT(token, process.env.ACCESS_TOKEN_SECRET); 
        // Token ko verify karte hain ACCESS_TOKEN_SECRET key ke saath, aur decoded token nikalte hain.

        const user = await User.findById(decodedToken?._id).select("-password -refreshToken"); 
        // Decoded token se user ki ID nikal ke database se user ko dhoondhte hain, lekin password aur refreshToken ko response mein se hata dete hain.

        if (!user) { 
            throw new ApiError(401, "Invalid access token"); 
            // Agar user nahi milta to invalid access token ka error throw karte hain.
        }

        req.user = user; 
        // Agar sab kuch sahi hai, to user ko request object me attach kar dete hain taaki next middleware me use ho sake.

        next(); 
        // Ab ye middleware khatam hota hai aur request ko next middleware ya route handler me bhejte hain.

    } catch (error) { 
        throw new ApiError(401, "Invalid access token"); 
        // Agar try block me koi error aata hai, to 401 Unauthorized error throw karte hain.
    }
});
export default verifyJWT
