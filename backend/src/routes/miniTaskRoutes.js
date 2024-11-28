import express from "express";
import { createMiniTask } from "../controllers/card/miniTaskController.js";
import { protect } from "../middleware/authMiddleware.js";

export const miniTaskRoutes = express.Router();

miniTaskRoutes.post("/create", protect, createMiniTask);
