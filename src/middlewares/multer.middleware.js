import multer from "multer";

// Multer storage configuration
const storage = multer.diskStorage({
    // File upload destination set kar rahe hain
    destination: function(req, file, cb) {
        cb(null, "./public/temp"); // Files 'public/temp' folder mein store hongi
    },
    // Filename set karne ka function
    filename: function(req, file, cb) {
        cb(null, file.originalname); // File ka original naam use kar rahe hain
    }
});

// Multer instance create kar rahe hain storage ke saath
export const upload = multer({
    storage: storage // Storage configuration pass kar rahe hain
});
