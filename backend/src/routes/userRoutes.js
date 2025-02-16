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
  creatorMiddleware,
  protect,
} from "../middleware/authMiddleware.js";
import {
  deleteUser,
  getAllUsers,
} from "../controllers/auth/adminController.js";
import { uploader } from "../utils/uploader.js";


export const userRoutes = express.Router();

userRoutes.post("/register", registerUser);
userRoutes.post("/login", loginUser);
userRoutes.get("/user", protect, getUser);
userRoutes.patch("/user", protect, updateUser);

// admin route
userRoutes.delete("/admin/users/:id", protect, adminMiddleware, deleteUser);
userRoutes.get("/admin/users", protect, creatorMiddleware, getAllUsers);

// get all users for share
// auth/users/share 

userRoutes.patch("/user/edit", protect, uploader?.single("img"),(req,res,next)=>{
  req.body = JSON.parse(req.body.data)
  next()
}, updateUser);

userRoutes.get("/users", protect, getUsersWithoutSelf)
userRoutes.get("/users/user", protect, getUser)
