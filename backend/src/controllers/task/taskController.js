import asyncHandler from "express-async-handler";
import TaskModel from "../../models/tasks/taskModel.js";

export const createTask = asyncHandler(async (req, res) => {
  try {
    const { title, description, status, dueDate } = req.body;

    if (!title || title.trim() === "") {
      return res.status(400).json({ message: "Title is required" });
    }

    const task = new TaskModel({
      title,
      description,
      status,
      dueDate,
      user: req.user._id,
    });
    await task.save();

    res.status(201).json({ message: "Task Created successfully!" }, task);
  } catch (error) {}
});

export const getTasks = asyncHandler(async (req, res) => {
  try {
    const userId = req.user._id;

    if (!userId)
      return res.status(401).json({ message: "User not authenticated" });

    const tasks = await TaskModel.find({ user: req.user._id });

    res.status(200).json({
      message: "Tasks retrived successfully",
      tasks,
      length: tasks.length,
    });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
});

export const getTask = asyncHandler(async (req, res) => {
  try {
    const userId = req.user._id;

    if (!userId)
      return res.status(401).json({ message: "User not authenticated" });

    const { id } = req.params;
    if (!id) return res.status(401).json({ message: "Id not Given" });

    const task = await TaskModel.findById(id);

    if (!task.user.equals(userId)) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    res.status(200).json({
      message: "Task retrived successfully",
      task,
    });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
});

export const updateTask = asyncHandler(async (req, res) => {
  try {
    const userId = req.user._id;

    if (!userId)
      return res.status(401).json({ message: "User not authenticated" });

    const { id } = req.params;
    if (!id) return res.status(401).json({ message: "Id not Given" });

    const { title, description, dueDate, priority, status, completed } =
      req.body;

    const task = await TaskModel.findById(id);

    if (!task.user.equals(userId)) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    if (title) task.title = title;
    if (description) task.description = description;
    if (dueDate) task.dueDate = dueDate;
    if (priority) task.priority = priority;
    if (status) task.status = status;
    if (completed) task.completed = completed;

    await task.save();

    res.status(200).json({
      message: "Task updated successfully",
      task,
    });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
});

export const deleteTask = asyncHandler(async (req, res) => {
  try {
    const userId = req.user._id;

    if (!userId)
      return res.status(401).json({ message: "User not authenticated" });

    const { id } = req.params;
    if (!id) return res.status(401).json({ message: "Id not Given" });

    const task = await TaskModel.findById(id);
    if (!task) return res.status(404).json({ message: "Task not found" });

    if (!task.user.equals(userId)) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    await TaskModel.findByIdAndDelete(id);

    res.status(200).json({
      message: "Task deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
});
