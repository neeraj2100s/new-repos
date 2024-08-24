import { v2 as cloudinary } from "cloudinary"; // Cloudinary ka v2 version import kar rahe hain
import fs from "fs"; // File system module (fs) import kar rahe hain

// Cloudinary ke liye configuration set kar rahe hain
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, // Cloudinary cloud name environment variable se le rahe hain
    api_key: process.env.CLOUDINARY_API_KEY, // Cloudinary API key environment variable se le rahe hain
    api_secret: process.env.CLOUDINARY_API_SECRET // Cloudinary API secret environment variable se le rahe hain
});

// Cloudinary par file upload karne ka function
const uploadOnCloudinary = async (localFilePath) => {
 try {
    if (!localFilePath) return null; // Agar local file path nahi hai, toh null return karo
    
    // File ko Cloudinary par upload kar rahe hain
    const response = await cloudinary.uploader.upload(localFilePath, {
        resource_type: "auto" // File ka resource type automatically detect ho jayega
    });
    
    // File successfuly upload ho gayi hai
    console.log("file is uploaded on cloudinary", response.url);
   
 } catch (error) {
    fs.unlinkSync(localFilePath); // Agar error aayi toh local file ko delete kar rahe hain
    return null; // Null return kar rahe hain
 }
}
