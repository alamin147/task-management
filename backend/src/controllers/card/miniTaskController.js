import asyncHandler from "express-async-handler";
import subCardModel from "../../models/cards/subCardModel.js";
import miniTaskModel from "../../models/cards/miniTaskModel.js";
import TaskModel from "../../models/tasks/taskModel.js";
import { uploadIMG } from "../../utils/cloudinary.js";

export const createMiniTask = asyncHandler(async (req, res) => {
  const { title, img, description, dueDate, completed, subtaskId } = req.body;
  const userId = req.user.id;

  if (!subtaskId) {
    return res.status(400).json({ message: "Task id is required" });
  }

  const task = await subCardModel.findById(subtaskId);
  if (!task) {
    return res.status(404).json({ message: "Task not found" });
  }

  const mainTask = await TaskModel.findOne({
    subcards: { $in: [task._id] },
  });
  console.log(mainTask);

  if (!mainTask) {
    return res.status(404).json({ message: "Task not found" });
  }

  if (!mainTask.user.equals(userId)) {
    return res.status(401).json({ message: "User not authorized" });
  }

  const miniTask = await miniTaskModel.create({
    title,
    img,
    description,
    dueDate,
    completed,
  });

  if (!miniTask) {
    return res.status(500).json({ message: "Failed to create subtask" });
  }

  task.miniTasks.push({ _id: miniTask._id });
  await task.save();

  res.status(200).json({
    message: "Mini task created and added to Subtask successfully",
    task,
  });
});

export const updateMiniTask = asyncHandler(async (req, res) => {
  try {
    const data = req.body;
    const img = req.file;
    let fileName;

    if (img.originalname.toLowerCase().includes(".jpg")) {
      fileName = img.originalname.split(".jpg")[0];
    }
    if (img.originalname.toLowerCase().includes(".jpeg")) {
      fileName = img.originalname.split(".jpeg")[0];
    }
    if (img.originalname.toLowerCase().includes(".png")) {
      fileName = img.originalname.split(".png")[0];
    }

    const fileLocation = img.path;
  
    const res = await uploadIMG(fileLocation, fileName);
    const imgURL = res.secure_url;
  
    res.status(200).json({
      message: "Task updated successfully",
    });
  } catch (error) {
    // console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});
