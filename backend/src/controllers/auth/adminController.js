import asyncHandler from "express-async-handler";
import User from "../../models/auth/UserModel.js";
import TaskModel from "../../models/tasks/taskModel.js";

export const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // attempt to find and delete the user
  try {
    const user = await User.findByIdAndDelete(id);
    if (!user) {
      res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Cannot Delete User" });
  }
});

// get all users
export const getAllUsers = asyncHandler(async (req, res) => {
  try {
    const users = await User.find({});

    if (!users) {
      res.status(404).json({ message: "No users found" });
    }

    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Cannot get users" });
  }
});

// Get all users with their details, activity status, and tasks count
export const getUsersWithDetails = asyncHandler(async (req, res) => {
  try {
    // Get all users
    const users = await User.find({}).select('-password');

    if (!users || users.length === 0) {
      return res.status(404).json({ message: "No users found" });
    }

    // Get task counts for each user
    const usersWithDetails = await Promise.all(users.map(async (user) => {
      // Count total tasks
      const totalTasks = await TaskModel.countDocuments({ user: user._id });

      // Count completed tasks
      const completedTasks = await TaskModel.countDocuments({
        user: user._id,
        completed: true
      });

      // Calculate completion rate
      const completionRate = totalTasks > 0
        ? Math.round((completedTasks / totalTasks) * 100)
        : 0;

      return {
        ...user.toObject(),
        totalTasks,
        completedTasks,
        completionRate,
      };
    }));

    res.status(200).json(usersWithDetails);
  } catch (error) {
    console.error("Error getting users with details:", error);
    res.status(500).json({ message: "Cannot get user details" });
  }
});

// Change user role (promote/demote)
export const changeUserRole = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { role } = req.body;

  // Validate role
  if (!role || !['user', 'admin'].includes(role)) {
    return res.status(400).json({ message: "Invalid role. Must be 'user' or 'admin'" });
  }

  try {
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update user role
    user.role = role;
    await user.save();

    res.status(200).json({
      message: `User role updated to ${role} successfully`,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error("Error changing user role:", error);
    res.status(500).json({ message: "Cannot update user role" });
  }
});

// Suspend/reactivate user account
export const toggleUserStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  // Validate status
  if (status !== 'active' && status !== 'suspended') {
    return res.status(400).json({ message: "Invalid status. Must be 'active' or 'suspended'" });
  }

  try {
    // We need to add a status field to the user model if it doesn't exist
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Add status field to the user document if it doesn't exist
    // This is a workaround since we don't want to modify the User schema
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { $set: { status: status } },
      { new: true, runValidators: true }
    );

    const statusMessage = status === 'active'
      ? "User account activated successfully"
      : "User account suspended successfully";

    res.status(200).json({
      message: statusMessage,
      user: {
        id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        status: updatedUser.status
      }
    });
  } catch (error) {
    console.error("Error toggling user status:", error);
    res.status(500).json({ message: "Cannot update user status" });
  }
});

// Get user analytics
export const getUserAnalytics = asyncHandler(async (req, res) => {
  try {
    // Count total users
    const totalUsers = await User.countDocuments();

    // Count users by role
    const adminUsers = await User.countDocuments({ role: 'admin' });
    const regularUsers = await User.countDocuments({ role: 'user' });

    // Get active users (users with tasks in the last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const activeUserIds = await TaskModel.distinct('user', {
      updatedAt: { $gte: thirtyDaysAgo }
    });

    const activeUsers = activeUserIds.length;

    // Get task completion stats
    const totalTasks = await TaskModel.countDocuments();
    const completedTasks = await TaskModel.countDocuments({ completed: true });
    const completionRate = totalTasks > 0
      ? Math.round((completedTasks / totalTasks) * 100)
      : 0;

    res.status(200).json({
      userStats: {
        totalUsers,
        adminUsers,
        regularUsers,
        activeUsers,
      },
      taskStats: {
        totalTasks,
        completedTasks,
        completionRate,
      }
    });
  } catch (error) {
    console.error("Error getting user analytics:", error);
    res.status(500).json({ message: "Cannot get user analytics" });
  }
});
