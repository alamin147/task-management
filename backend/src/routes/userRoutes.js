import express from "express";
import {
  changePassword,
  forgotPassword,
  getUser,
  loginUser,
  logoutUser,
  registerUser,
  resetPassword,
  updateUser,
  userLoginStatus,
  verifyEmail,
  verifyUser,
} from "../controllers/auth/userController.js";
import {
  adminMiddleware,
  creatorMiddleware,
  protect,
} from "../middleware/authMiddleware.js";
import {
  deleteUser,
  getAllUsers,
} from "../controllers/auth/adminController.js";

export const userRoutes = express.Router();

userRoutes.post("/register", registerUser);
userRoutes.post("/login", loginUser);
userRoutes.get("/logout", logoutUser);
userRoutes.get("/user", protect, getUser);
userRoutes.patch("/user", protect, updateUser);

// admin route
userRoutes.delete("/admin/users/:id", protect, adminMiddleware, deleteUser);

// get all users
userRoutes.get("/admin/users", protect, creatorMiddleware, getAllUsers);

// login status
userRoutes.get("/login-status", userLoginStatus);

// email verification
userRoutes.post("/verify-email", protect, verifyEmail);

// veriify user --> email verification
userRoutes.post("/verify-user/:verificationToken", verifyUser);

// forgot password
userRoutes.post("/forgot-password", forgotPassword);

//reset password
userRoutes.post("/reset-password/:resetPasswordToken", resetPassword);

// change password ---> user must be logged in
userRoutes.patch("/change-password", protect, changePassword);

