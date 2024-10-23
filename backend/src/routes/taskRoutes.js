import express from "express";
import {
  createTask,
  getTask,
  getTasks,
  updateTask,
  deleteTask,
} from "../controllers/task/taskController.js";
import { protect } from "../middleware/authMiddleware.js";

export const TaskRoutes = express.Router();

TaskRoutes.post("/create", protect, createTask);

TaskRoutes.get("/tasks", protect, getTasks);

TaskRoutes.get("/:id", protect, getTask);

TaskRoutes.patch("/:id", protect, updateTask);

TaskRoutes.delete("/:id", protect, deleteTask);
