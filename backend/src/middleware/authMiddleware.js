import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";
import User from "../models/auth/UserModel.js";

export const protect = asyncHandler(async (req, res, next) => {
  try {
    // check if user is logged in
    const token = req.headers.authorization;
    // console.log("token from auth back", token);

    if (!token) {
      // 401 Unauthorized
      return res.status(401).json({ message: "Not authorized, please login!" });
    }

    // verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // get user details from the token ----> exclude password
    const user = await User.findById(decoded.id).select("-password");

    // console.log(user)
    // check if user exists
    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }

    // check if user is suspended
    if (user.status === 'suspended') {
      return res.status(403).json({ message: "Your account has been suspended. Please contact an administrator." });
    }

    // set user details in the request object
    req.user = user;
    // console.log(req.user)
    next();
    // console.log("first").
  } catch (error) {
    // 401 Unauthorized
    res.status(401).json({ message: "Not authorized, token failed!" });
  }
});

// admin middleware
export const adminMiddleware = asyncHandler(async (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    // if user is admin, move to the next middleware/controller
    next();
    return;
  }
  // if not admin, send 403 Forbidden --> terminate the request
  return res.status(403).json({ message: "Only admins can do this!" });
});

