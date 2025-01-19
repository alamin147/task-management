import express from "express";


import { TaskRoutes } from "./taskRoutes.js";
import { userRoutes } from "./userRoutes.js";
import { CardRoutes } from "./cardRoutes.js";
import { miniTaskRoutes } from "./miniTaskRoutes.js";
import { userInfoRoutes } from "./userInfoRoutes.js";

export const routes = express.Router();

routes.use("/user", userInfoRoutes);

routes.use("/task", TaskRoutes);

routes.use("/auth", userRoutes);

routes.use("/card", CardRoutes);

routes.use("/minitask", miniTaskRoutes);
