import asyncHandler from "express-async-handler";
import TaskModel from "../../models/tasks/taskModel.js";
import subCardModel from "../../models/cards/subCardModel.js";
import miniTaskModel from "../../models/cards/miniTaskModel.js";
import { cloudinaryConfig } from "../../utils/configs.js";

export const createSubTask = asyncHandler(async (req, res) => {
  const { title, taskId } = req.body;
  const userId = req.user.id;

  // if (!task.user.equals(userId)) {
  //   return res.status(401).json({ message: "User not authorized" });
  // }
  if (title) {
    title.trim();
  }
  if (!taskId) {
    return res.status(400).json({ message: "Task id is required" });
  }

  const task = await TaskModel.findById(taskId);
  if (!task) {
    return res.status(404).json({ message: "Task not found" });
  }

  if (!task.user.equals(userId)) {
    return res.status(401).json({ message: "User not authorized" });
  }

  const subCard = await subCardModel.create({ title });

  if (!subCard) {
    return res.status(500).json({ message: "Failed to create subtask" });
  }

  task.subcards.push({ _id: subCard._id });
  await task.save();

  res.status(200).json({
    message: "Subtask created and added to task successfully",
    task,
  });
});

export const updateSubTask = asyncHandler(async (req, res) => {
  const { title, _id } = req.body;

  if (!_id) {
    return res
      .status(400)
      .json({ status: 400, message: "Subtask ID is required" });
  }

  const updatedTitle = title?.trim();
  if (updatedTitle === "") {
    return res
      .status(400)
      .json({ status: 400, message: "Title cannot be empty" });
  }

  try {
    const subtask = await subCardModel.findById(_id);
    if (!subtask) {
      return res
        .status(404)
        .json({ status: 404, message: "Subtask not found" });
    }

    if (updatedTitle) {
      subtask.title = updatedTitle;
      await subtask.save();
    }

    res.status(200).json({
      status: 200,
      message: "Subtask updated successfully",
    });
  } catch (error) {
    console.error("Error updating subtask:", error);
    res.status(500).json({ status: 500, message: "Internal server error" });
  }
});

export const deleteSubtask = asyncHandler(async (req, res) => {
  const { taskId, subtaskId } = req.body;

  if (!taskId || !subtaskId) {
    return res.status(400).json({
      status: 400,
      message: "Both taskId and subtaskId are required",
    });
  }

  try {
    const task = await TaskModel.findById(taskId);
    if (!task) {
      return res.status(404).json({ status: 404, message: "Task not found" });
    }

    const subCard = await subCardModel.findById(subtaskId);
    if (!subCard) {
      return res
        .status(404)
        .json({ status: 404, message: "Subtask not found" });
    }

    // Soft delete the subcard
    await subCardModel.findByIdAndUpdate(subtaskId, { isDeleted: true });

    // Soft delete all mini tasks in this subcard
    for (const miniTaskId of subCard.miniTasks) {
      await miniTaskModel.findByIdAndUpdate(miniTaskId, { isDeleted: true });
    }

    return res.status(200).json({
      status: 200,
      message: "Subtask deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting subtask:", error);
    return res.status(500).json({
      status: 500,
      message: "Internal server error",
      error: error.message,
    });
  }
});

export const reorderSubTasks = asyncHandler(async (req, res) => {
  const { taskId, subtasks } = req.body;
  const userId = req.user.id;

  if (!taskId) {
    return res.status(400).json({
      status: 400,
      message: "Task ID is required",
    });
  }

  if (!subtasks || !Array.isArray(subtasks)) {
    return res.status(400).json({
      status: 400,
      message: "Subtasks array is required",
    });
  }

  try {
    const task = await TaskModel.findById(taskId);

    if (!task) {
      return res.status(404).json({
        status: 404,
        message: "Task not found",
      });
    }

    const isOwner = task.user.equals(userId);
    const isShared = task.shared.some((sharedUserId) => sharedUserId.equals(userId));

    if (!isOwner && !isShared) {
      return res.status(401).json({
        status: 401,
        message: "User not authorized to modify this task",
      });
    }

    task.subcards = subtasks;
    await task.save();

    return res.status(200).json({
      status: 200,
      message: "Subtasks reordered successfully",
      task,
    });
  } catch (error) {
    console.error("Error reordering subtasks:", error);
    return res.status(500).json({
      status: 500,
      message: "Failed to reorder subtasks",
    });
  }
});
