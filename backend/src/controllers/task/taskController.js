import asyncHandler from "express-async-handler";
import TaskModel from "../../models/tasks/taskModel.js";
import miniTaskModel from "../../models/cards/miniTaskModel.js";
import subCardModel from "../../models/cards/subCardModel.js";
export const createTask = asyncHandler(async (req, res) => {
  try {
    // console.log("6", req.user);
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
    return res
      .status(201)
      .json({ message: "Task Created successfully!", task });
  } catch (error) {
    res.status(400).json({ message: "Task Failed to create!" });
  }
});

export const getSharedTasks = async (req, res) => {
  try {
    const userId = req.user._id;
    // const userEmail = req?.user?.email;
    // console.log({userId});
    if (!userId) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const allTasks = await TaskModel.find({
      shared: { $in: [userId] },
      isDeleted: { $ne: true }
    }).populate({
      path: "subcards",
      match: { isDeleted: { $ne: true } },
      select: "title",
      populate: {
        path: "miniTasks",
        match: { isDeleted: { $ne: true } },
      },
    });

    const priorityOrder = { high: 1, medium: 2, low: 3 };
    allTasks.sort((a, b) => {
      if (a.completed !== b.completed) {
        return a.completed - b.completed;
      }
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    });

    let tasks = allTasks;

    res.status(200).json({
      message: "Tasks retrieved successfully",
      tasks,
      length: tasks.length,
    });
  } catch (error) {
    console.error("Error retrieving tasks:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};
export const getTasks = async (req, res) => {
  try {
    const { status } = req.params;
    const userId = req.user._id;
    const userEmail = req?.user?.email;
    // console.log(req.user);
    if (!userId) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const allTasks = await TaskModel.find({
      user: userId,
      isDeleted: { $ne: true }
    }).populate({
      path: "subcards",
      match: { isDeleted: { $ne: true } },
      select: "title",
      populate: {
        path: "miniTasks",
        match: { isDeleted: { $ne: true } },
      },
    });

    const priorityOrder = { high: 1, medium: 2, low: 3 };
    allTasks.sort((a, b) => {
      if (a.completed !== b.completed) {
        return a.completed - b.completed;
      }
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    });

    let tasks = allTasks;

    if (status === "completed") {
      tasks = allTasks.filter((task) => task.completed);
    } else if (status === "pending") {
      tasks = allTasks.filter((task) => !task.completed);
    } else if (status === "due") {
      tasks = allTasks.filter(
        (task) => !task.completed && new Date(task.dueDate) < new Date()
      );
    }

    res.status(200).json({
      message: "Tasks retrieved successfully",
      tasks,
      length: tasks.length,
    });
  } catch (error) {
    console.error("Error retrieving tasks:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const getTask = asyncHandler(async (req, res) => {
  try {
    const userId = req.user._id;

    if (!userId)
      return res.status(401).json({ message: "User not authenticated" });

    const { id } = req.params;
    if (!id) return res.status(401).json({ message: "Id not Given" });

    const task = await TaskModel.findOne({
      _id: id,
      isDeleted: { $ne: true }
    }).populate([
      {
        path: "subcards",
        match: { isDeleted: { $ne: true } },
        select: "title",
        populate: {
          path: "miniTasks",
          match: { isDeleted: { $ne: true } },
        },
      },
      {
        path: "shared",
        select: "name email photo",
      },
    ]);

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
      return res
        .status(401)
        .json({ status: 401, message: "User not authenticated" });

    const { id } = req.params;
    if (!id)
      return res.status(401).json({ status: 401, message: "Id not Given" });

    const task = await TaskModel.findById(id);
    if (!task)
      return res.status(404).json({ status: 404, message: "Task not found" });

    if (!task.user.equals(userId)) {
      return res
        .status(401)
        .json({ status: 401, message: "User not authenticated" });
    }

    // Soft delete: set isDeleted to true instead of removing from database
    await TaskModel.findByIdAndUpdate(id, { isDeleted: true });

    res.status(200).json({
      status: 200,
      message: "Task deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ status: 500, message: "Something went wrong" });
  }
});

export const duplicateTask = asyncHandler(async (req, res) => {
  try {
    const userId = req.user._id;
    const { taskId } = req.params;

    if (!userId)
      return res.status(401).json({ message: "User not authenticated" });
    if (!taskId)
      return res.status(400).json({ message: "Task ID not provided" });

    const task = await TaskModel.findOne({
      _id: taskId,
      isDeleted: { $ne: true }
    }).populate({
      path: "subcards",
      match: { isDeleted: { $ne: true } },
      populate: {
        path: "miniTasks",
        match: { isDeleted: { $ne: true } }
      },
    });

    if (!task) return res.status(404).json({ message: "Task not found" });

    const newSubcards = [];
    for (const subcard of task.subcards) {
      const newMiniTasks = [];
      for (const miniTask of subcard.miniTasks) {
        const newMiniTask = await miniTaskModel.create({
          title: miniTask.title,
          img: miniTask.img,
          description: miniTask.description,
          dueDate: miniTask.dueDate,
          completed: miniTask.completed,
        });
        newMiniTasks.push(newMiniTask._id);
      }

      const newSubcard = await subCardModel.create({
        title: subcard.title,
        miniTasks: newMiniTasks,
      });
      newSubcards.push(newSubcard._id);
    }

    const newTask = await TaskModel.create({
      title: task.title,
      description: task.description,
      dueDate: task.dueDate,
      status: task.status,
      completed: task.completed,
      priority: task.priority,
      user: userId,
      subcards: newSubcards,
    });

    res.status(201).json({
      message: "Task duplicated successfully",
      task: newTask,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong" });
  }
});

export const shareTask = asyncHandler(async (req, res) => {
  try {
    const userId = req.user._id;
    const { taskId } = req.params;
    const users = req.body;
    // users=['6718d8023254c674957c9f35']
    if (!userId)
      return res
        .status(401)
        .json({ status: 401, message: "User not authenticated" });
    if (!taskId)
      return res
        .status(400)
        .json({ status: 400, message: "Task ID not provided" });

    if (!Array.isArray(users) || users.length === 0)
      return res
        .status(400)
        .json({ status: 400, message: "No users provided for sharing" });

    try {
      const task = await TaskModel.findById(taskId);

      if (!task)
        return res.status(404).json({ status: 404, message: "Task not found" });

      const newShared = users.filter((user) => !task.shared.includes(user));

      if (newShared.length > 0) {
        task.shared.push(...newShared);
        await task.save();
      }

      res.status(201).json({
        status: 200,
        message: `${
          newShared?.length
            ? `Task shared with ${newShared.length} people successfully`
            : "Task shared successfully"
        }`,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ status: 500, message: "Server error" });
    }
  } catch (Error) {
    res.status(500).json({ status: 500, message: "Server error" });
  }
});

export const deleteSharedUser = asyncHandler(async (req, res) => {
  try {
    const userId = req.user._id;
    const { taskId } = req.params;

    const { user } = req.body;
    if (!userId)
      return res
        .status(401)
        .json({ status: 401, message: "User not authenticated" });
    if (!taskId)
      return res
        .status(400)
        .json({ status: 400, message: "Task ID not provided" });

    if (!user)
      return res.status(400).json({ status: 400, message: "No user given" });

    try {
      const task = await TaskModel.findById(taskId);

      if (!task)
        return res.status(404).json({ status: 404, message: "Task not found" });
      if (
        task.shared &&
        task.shared.some((sharedUser) => sharedUser.toString() == user)
      ) {
        task.shared = task.shared.filter(
          (sharedUser) => sharedUser.toString() != user
        ); // Remove the user
        await task.save(); // Save the updated task
      }
      res.status(201).json({
        status: 200,
        message: `User Deleted Successfully`,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ status: 500, message: "Server error" });
    }
  } catch (Error) {
    res.status(500).json({ status: 500, message: "Server error" });
  }
});
