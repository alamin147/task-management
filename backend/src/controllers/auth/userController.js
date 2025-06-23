import asyncHandler from "express-async-handler";
import User from "../../models/auth/UserModel.js";
import generateToken from "../../helpers/generateToken.js";
import bcrypt from "bcrypt";
import cloudinary from "cloudinary";
import { uploadIMG } from "../../utils/cloudinary.js";
import { configserverENV } from "../../utils/configs.js";
import { extractPublicId } from "../../utils/cloudinaryPublic.js";

cloudinary.v2.config({
  cloud_name: configserverENV.cloud_name,
  api_key: configserverENV.cloud_api_key,
  api_secret: configserverENV.cloud_api_secret,
});
export const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  //validation
  if (!name || !email || !password) {
    // 400 Bad Request
    return res.status(400).json({ message: "All fields are required" });
  }

  // check password length
  if (password.length < 6) {
    return res
      .status(400)
      .json({ message: "Password must be at least 6 characters" });
  }

  // check if user already exists
  const userExists = await User.findOne({ email });

  if (userExists) {
    // bad request
    return res.status(400).json({ message: "User already exists" });
  }

  // create new user
  const user = await User.create({
    name,
    email,
    password,
  });

  // generate token with user id
  const token = await generateToken(user._id);

  // send back the user and token in the response to the client
  res.cookie("token", token, {
    path: "/",
    httpOnly: true,
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    sameSite: "none", // cross-site access --> allow all third-party cookies
    secure: true,
  });

  if (user) {
    const { _id, name, email, role, photo, bio, isVerified } = user;

    // 201 Created
    return res.status(201).json({
      _id,
      name,
      email,
      role,
      photo,
      bio,
      isVerified,
      token,
    });
  } else {
    res.status(400).json({ message: "Invalid user data" });
  }
});

// user login
export const loginUser = asyncHandler(async (req, res) => {
  // get email and password from req.body
  const { email, password } = req.body;

  // validation
  if (!email || !password) {
    // 400 Bad Request
    return res.status(400).json({ message: "All fields are required" });
  }

  // check if user exists
  const userExists = await User.findOne({ email });

  if (!userExists) {
    return res.status(404).json({ message: "User not found, sign up!" });
  }


  // check id the password match the hashed password in the database
  const isMatch = await bcrypt.compare(password, userExists.password);

  if (!isMatch) {
      // 400 Bad Request
      return res.status(400).json({ message: "Invalid credentials" });
    }

    if(userExists.status === 'suspended') {
      return res.status(403).json({ message: "Your account has been suspended. Please contact an administrator." });
    }
//   console.log({userExists})
  // generate token with user id
  const token = generateToken(
    userExists._id,
    userExists.name,
    userExists.email,
    userExists.role,
    userExists.photo
  );

  if (userExists && isMatch) {
    const { _id, name, email, role, photo, bio, isVerified } = userExists;

    // set the token in the cookie
    res.cookie("token", token, {
      path: "/",
      httpOnly: true,
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
      sameSite: "none",
      secure: false,
    });

    // send back the user and token in the response to the client
    res.status(200).json({
      _id,
      name,
      email,
      role,
      photo,
      bio,
      isVerified,
      token,
    });
  } else {
    res.status(400).json({ message: "Invalid email or password" });
  }
});

// get single user
export const getUser = asyncHandler(async (req, res) => {
  // get user details from the token ----> exclude password
  const user = await User.findById(req.user._id).select("-password");

  if (user) {
    res.status(200).json(user);
  } else {
    // 404 Not Found
    res.status(404).json({ message: "User not found" });
  }
});
export const getUsersWithoutSelf = asyncHandler(async (req, res) => {
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

// update user

export const updateUser = asyncHandler(async (req, res) => {
  try {
    const userId = req.user._id;
    const data = req?.body;
    const img = req?.file;

    if (!userId) {
      return res.status(404).json({ message: "User not found" });
    }

    const existingUser = await User.findById(userId);
    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }

    if (img && existingUser.photo) {
      try {
        const publicId = extractPublicId(existingUser.photo);

        if (publicId) {
          // console.log({ publicId });
          const deleteResponse = await cloudinary.v2.uploader.destroy(publicId);
          // console.log("Cloudinary Delete Response:", deleteResponse);
        } else {
          console.warn("No public ID found for image deletion.");
        }
      } catch (deleteError) {
        console.error("Error deleting old profile image:", deleteError.message);
      }
    }

    if (img) {
      const fileName = img.originalname
        .toLowerCase()
        .split(/\.(jpg|jpeg|png)$/)[0];
      const fileLocation = img.path;

      const uploadResult = await uploadIMG(fileLocation, fileName);
      if (uploadResult?.secure_url) {
        data.photo = uploadResult.secure_url;
      }
    }

    const updatedUser = await User.findOneAndUpdate(
      { _id: userId },
      { $set: data },
      { new: true }
    );

    if (!updatedUser) {
      return res
        .status(404)
        .json({ message: "User profile could not be updated" });
    }

    const token = generateToken(
      userId,
      updatedUser.name,
      updatedUser.email,
      updatedUser.role,
      updatedUser.photo
    );

    res.cookie("token", token, {
      path: "/",
      httpOnly: true,
      maxAge: 30 * 24 * 60 * 60 * 1000,
      sameSite: "none",
      secure: false,
    });

    res.status(200).json({
      status: 200,
      message: "User profile updated successfully",
      token,
    });
  } catch (error) {
    console.error("User profile update failed:", error.message);
    res.status(500).json({ status: 500, message: error?.message });
  }
});
