import express from "express";
import { createMiniTask, deleteMiniTask, updateMiniTask } from "../controllers/card/miniTaskController.js";
import { protect } from "../middleware/authMiddleware.js";
import { uploader } from "../utils/uploader.js";


export const miniTaskRoutes = express.Router();

miniTaskRoutes.post("/update", protect, uploader?.single("img"),(req,res,next)=>{
  
req.body = JSON.parse(req.body.data)
  next()
} ,updateMiniTask);

miniTaskRoutes.post("/create", protect, createMiniTask);
miniTaskRoutes.delete("/delete/minitask", protect, deleteMiniTask);
