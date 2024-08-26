// app.js
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import userRouter from "./routes/user.routes.js";  // Importing userRouter to define user-related routes

const app = express();

// CORS middleware setup karte hain taaki specific origins se requests allow ho
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}));

// JSON aur URL-encoded data ko handle karne ke liye middleware setup karte hain
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));

// Static files serve karne ke liye middleware setup karte hain
app.use(express.static("public"));

// Cookies ko parse karne ke liye middleware setup karte hain
app.use(cookieParser());

// User routes ko "/api/v1/users" path ke saath include karte hain
app.use("/api/v1/users", userRouter);

// Express application ko export karte hain taaki server me use kiya ja sake
export default app;
