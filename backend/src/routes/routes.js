import express from "express";


import { TaskRoutes } from "./taskRoutes.js";
import { userRoutes } from "./userRoutes.js";
import { CardRoutes } from "./cardRoutes.js";

export const routes = express.Router();

routes.use("/task", TaskRoutes);

routes.use("/auth", userRoutes);

routes.use("/card", CardRoutes);
