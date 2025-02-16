import express from "express";


import { TaskRoutes } from "./taskRoutes.js";
import { userRoutes } from "./userRoutes.js";
import { CardRoutes } from "./cardRoutes.js";
import { miniTaskRoutes } from "./miniTaskRoutes.js";

export const routes = express.Router();

routes.use("/auth", userRoutes);

routes.use("/task", TaskRoutes);

routes.use("/card", CardRoutes);

routes.use("/minitask", miniTaskRoutes);
