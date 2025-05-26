import express from "express";
import {
  getTask,
  getTasks,
  updateTask,
  deleteTask,
} from "../controllers/task/taskController.js";
import { protect } from "../middleware/authMiddleware.js";
import { createSubTask, deleteSubtask, reorderSubTasks, updateSubTask } from "../controllers/card/cardController.js";

export const CardRoutes = express.Router();

CardRoutes.post("/sub-card", protect, createSubTask);

CardRoutes.get("/sub-cards", protect, getTasks);
// sub card only
CardRoutes.patch("/sub-card/update", protect, updateSubTask);

CardRoutes.delete("/sub-card/delete", protect, deleteSubtask);

CardRoutes.patch("/sub-card/reorder", protect, reorderSubTasks);

CardRoutes.get("/sub-card/:id", protect, getTask);
CardRoutes.patch("/sub-card/:id", protect, updateTask);
CardRoutes.delete("/sub-card/:id", protect, deleteTask);
