import express from "express";
import {
  createTask,
  getTask,
  getTasks,
  updateTask,
  deleteTask,
  duplicateTask,
  shareTask,
  getSharedTasks,
  deleteSharedUser,
} from "../controllers/task/taskController.js";
import { protect } from "../middleware/authMiddleware.js";

export const TaskRoutes = express.Router();

TaskRoutes.post("/create", protect, createTask);

TaskRoutes.get("/tasks/share", protect, getSharedTasks);

TaskRoutes.get("/tasks/:status", protect, getTasks);

TaskRoutes.get("/:id", protect, getTask);

TaskRoutes.patch("/:id", protect, updateTask);

TaskRoutes.delete("/:id", protect, deleteTask);

TaskRoutes.delete("/delete/share/:taskId", protect, deleteSharedUser);

TaskRoutes.post("/duplicate/:taskId", protect, duplicateTask);

TaskRoutes.post("/share/:taskId", protect, shareTask);
