import asyncHandler from "express-async-handler";
import TaskModel from "../../models/tasks/taskModel.js";
import subCardModel from "../../models/cards/subCardModel.js";

export const createSubTask = asyncHandler(async (req, res) => {
  const { title, taskId } = req.body;
  const userId = req.user.id;

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

  task.subcards.push({ _id: subCard._id, title: subCard.title });

  await task.save();

  res.status(200).json({
    message: "Subtask created and added to task successfully",
    task,
  });
});
