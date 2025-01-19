import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { getUsers } from "../controllers/user/userController.js";

export const userInfoRoutes = express.Router();


userInfoRoutes.get("/users", protect, getUsers);
