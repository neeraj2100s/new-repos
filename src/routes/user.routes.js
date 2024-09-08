import { Router } from "express";
import { loginUser, logOutUser, registerUser } from '../controller/user.controller.js';
import { upload } from "../middlewares/multer.middleware.js";
import verifyJWT from "../middlewares/auth.middleware.js";
const router = Router();

// "/register" path ke liye POST request ko handle karne ke liye upload middleware aur registerUser function use karte hain
router.route("/register").post(upload.fields([{ name: 'avatar', maxCount: 1 }, { name: 'coverImage', maxCount: 1 }]), registerUser);
router.route("/login").post(loginUser)
//secure routes
router.route("/logout").post(verifyJWT,logOutUser)

// Router ko export karte hain taaki app.js me use ho sake
export default router;
