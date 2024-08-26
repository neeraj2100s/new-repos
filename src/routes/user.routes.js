// user.routes.js
import { Router } from "express";
// user.routes.js
import { registerUser } from '../controller/user.controller.js';

const router = Router();

// "/register" path ke liye POST request ko handle karne ke liye registerUser function use karte hain
router.route("/register").post(registerUser);

// Router ko export karte hain taaki app.js me use ho sake
export default router;
