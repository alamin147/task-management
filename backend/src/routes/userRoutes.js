import express from "express";
import {
  getUser,
  getUsersWithoutSelf,
  loginUser,
  registerUser,
  updateUser,

} from "../controllers/auth/userController.js";
import {
  adminMiddleware,
  protect,
} from "../middleware/authMiddleware.js";
import {
  deleteUser,
  getAllUsers,
  getUsersWithDetails,
  changeUserRole,
  toggleUserStatus,
  getUserAnalytics
} from "../controllers/auth/adminController.js";
import { uploader } from "../utils/uploader.js";


export const userRoutes = express.Router();

userRoutes.post("/register", registerUser);
userRoutes.post("/login", loginUser);
userRoutes.get("/user", protect, getUser);
userRoutes.patch("/user", protect, updateUser);

// admin routes
userRoutes.get("/admin/users", protect, adminMiddleware, getAllUsers);
userRoutes.get("/admin/users/details", protect, adminMiddleware, getUsersWithDetails);
userRoutes.delete("/admin/users/:id", protect, adminMiddleware, deleteUser);
userRoutes.patch("/admin/users/:id/role", protect, adminMiddleware, changeUserRole);
userRoutes.patch("/admin/users/:id/status", protect, adminMiddleware, toggleUserStatus);
userRoutes.get("/admin/analytics", protect, adminMiddleware, getUserAnalytics);

// get all users for share
// auth/users/share

userRoutes.patch("/user/edit", protect, uploader?.single("img"),(req,res,next)=>{
  req.body = JSON.parse(req.body.data)
  next()
}, updateUser);

userRoutes.get("/users", protect, getUsersWithoutSelf)
userRoutes.get("/users/user", protect, getUser)
