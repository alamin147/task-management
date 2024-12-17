import express from "express";
import { createMiniTask, updateMiniTask } from "../controllers/card/miniTaskController.js";
import { protect } from "../middleware/authMiddleware.js";
import multer from "multer";
import path from "path";


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.resolve(process.cwd(), "uploads");
  
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname)); 
  },
});

const upload = multer({ storage });


export const miniTaskRoutes = express.Router();


miniTaskRoutes.post("/update", protect, upload.single("img"),(req,res,next)=>{
  
req.body = JSON.parse(req.body.data)
  next()
} ,updateMiniTask);

miniTaskRoutes.post("/create", protect, createMiniTask);
