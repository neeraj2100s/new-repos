// user.routes.js
import { Router } from "express";
// user.routes.js
import { registerUser } from '../controller/user.controller.js';
import { upload } from "../middlewares/multer.middleware.js";
const router = Router();

// "/register" path ke liye POST request ko handle karne ke liye registerUser function use karte hain
router.route("/register").post(
    upload.fields([
        {
            name: "avatar",
            maxCount: 1
        },
        {
            name: "coverImage"
            , maxCount: 1
        }
    ]

    ),
    registerUser);

// Router ko export karte hain taaki app.js me use ho sake
export default router;
