import asyncHandler from "express-async-handler";
import subCardModel from "../../models/cards/subCardModel.js";
import miniTaskModel from "../../models/cards/miniTaskModel.js";
import TaskModel from "../../models/tasks/taskModel.js";
import { uploadIMG } from "../../utils/cloudinary.js";
import { extractPublicId } from "../../utils/cloudinaryPublic.js";
import cloudinary from "cloudinary";
import { configserverENV } from "../../utils/configs.js";

cloudinary.v2.config({
  cloud_name: configserverENV.cloud_name,
  api_key: configserverENV.cloud_api_key,
  api_secret: configserverENV.cloud_api_secret,
});

export const createMiniTask = asyncHandler(async (req, res) => {
  const { title, img, description, dueDate, completed, subtaskId } = req.body;
  const userId = req.user.id;

  if (!subtaskId){
    return res.status(400).json({ message: "Task id is required" });
}

  const task = await subCardModel.findById(subtaskId);
  if (!task){
    return res.status(404).json({ message: "Task not found" });
}

  const mainTask = await TaskModel.findOne({
    subcards: { $in: [task._id] },
  });
  console.log(mainTask);

  if (!mainTask){
    return res.status(404).json({ message: "Task not found" });
}

  if (!mainTask.user.equals(userId)){
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
    const data = req?.body;
    const img = req?.file;

    // Check if _id exists in the request body
    if (!data?._id) {
      return res.status(400).json({ message: "Task ID (_id) is required" });
    }

    // if image uploaded
    if (img) {
      const fileName = img.originalname
        .toLowerCase()
        .split(/\.(jpg|jpeg|png)$/)[0];
      const fileLocation = img.path;

      const uploadResult = await uploadIMG(fileLocation, fileName);
      if (uploadResult?.secure_url) {
        data.img = uploadResult.secure_url;
      }
    }

    // Update mini task
    const updatedTask = await miniTaskModel.findOneAndUpdate(
      { _id: data._id },
      { $set: data },
      { new: true }
    );

    if (!updatedTask) {
      return res.status(404).json({ message: "Mini task not found" });
    }

    res.status(200).json({
      status: 200,
      message: "Mini task updated successfully",
      data: updatedTask,
    });
  } catch (error) {
    console.error("Error in updateMiniTask:", error.message);
    res.status(500).json({ status: 500, message: "Internal server error" });
  }
});
export const deleteMiniTask = asyncHandler(async (req, res) => {
  const { miniTaskId, subtaskId } = req.body;
  const userId = req.user.id;

  if (!userId) return res.status(401).json({ message: "Unauthorized access" });

  try {
    const subcard = await subCardModel.findById(subtaskId);

    if (!subcard) {
      return res
        .status(400)
        .json({ status: 400, message: "Subcard Not found" });
    }

    const miniTaskIndex = subcard.miniTasks.indexOf(miniTaskId);
    if (miniTaskIndex === -1) {
      return res
        .status(400)
        .json({ status: 400, message: "MiniTask Not found in Subcard" });
    }

    subcard.miniTasks.splice(miniTaskIndex, 1);
    await subcard.save();

    const miniTask = await miniTaskModel.findById(miniTaskId);
    if (!miniTask) {
      return res
        .status(400)
        .json({ status: 400, message: "MiniTask Not found" });
    }

    const miniTaskName = miniTask.title;
    await miniTaskModel.findByIdAndDelete(miniTaskId);

    if (miniTask.img) {
      const publicId = extractPublicId(miniTask.img);
      try {
        await cloudinary.v2.uploader.destroy(publicId);
      } catch (err) {
        console.error("Failed to delete image from Cloudinary:", err);
      }
    }

    res
      .status(200)
      .json({ status: 200, message: `${miniTaskName} deleted successfully` });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: error.message });
  }
});
