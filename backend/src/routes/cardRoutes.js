import express from "express";
import {
  getTask,
  getTasks,
  updateTask,
  deleteTask,
} from "../controllers/task/taskController.js";
import { protect } from "../middleware/authMiddleware.js";
import { createSubTask, updateSubTask } from "../controllers/card/cardController.js";

export const CardRoutes = express.Router();

CardRoutes.post("/sub-card", protect, createSubTask);

CardRoutes.get("/sub-cards", protect, getTasks);
// sub card only
CardRoutes.patch("/sub-card/update", protect, updateSubTask);

CardRoutes.get("/sub-card/:id", protect, getTask);
CardRoutes.patch("/sub-card/:id", protect, updateTask);
CardRoutes.delete("/sub-card/:id", protect, deleteTask);