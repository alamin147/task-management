import asyncHandler from "express-async-handler";
import User from "../../models/auth/UserModel.js";

export const getUsers = asyncHandler(async (req, res) => {
  try {
    // console.log("first")
    const userId = req.user._id;
    if (!userId)
      return res.status(401).json({ message: "User not authenticated" });

    const users = await User.find({ _id: { $ne: userId } }).select("-password");
    if (!users) {
      return res.status(400).json({ message: "No user" });
    }

    res.status(200).json({
      message: "Users retrived successfully",
      users,
    });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
});
