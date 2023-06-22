import multer, { Multer, FileFilterCallback } from "multer";
import { Request, RequestHandler, Response } from "express";
import fs from "fs";
import User from "../model/user";

const imageDir = "./upload/images";

// Create the directory if it doesn't exist
fs.mkdirSync(imageDir, { recursive: true });

// Multer configuration



const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, imageDir);
  },
  filename: (_req, file, cb) => {
    const fileName = `${file.fieldname}_${Date.now()}_${file.originalname}`;
    cb(null, fileName);
  },
});

const multerConfig = multer({
    storage: storage,
    limits: {
      fileSize: 1024 * 1024 * 4
    }
  });

const updateUserProfile = async (req: Request, res: Response) => {
  const { userId } = req.params;
  const { name, email, password } = req.body;

  try {
    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (req.user.isAdmin || req.user.id === user.id) {
      // User is an admin or editing their own profile
      user.name = name || user.name;
      user.email = email || user.email;
      user.password = password || user.password;

      await user.save();

      return res
        .status(200)
        .json({ message: "Profile updated successfully", user });
    } else {
      return res.status(403).json({ message: "Unauthorized access" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const uploadProfilePicture: RequestHandler = async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (req.user.isAdmin || req.user.id === user.id) {
      // User is an admin or updating their own profile picture
      const file = req.file;

      if (!file) {
        return res.status(400).json({ message: "Profile picture missing" });
      }

      const profilePictureUrl = `${req.protocol}://${req.get(
        "host"
      )}/upload/images/${file.filename}`;
      user.profilePictureUrl = profilePictureUrl;
      await user.save();

      return res.status(200).json({
        message: "Profile picture uploaded successfully",
        profilePictureUrl,
      });
    } else {
      return res.status(403).json({ message: "Unauthorized access" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export {multerConfig, updateUserProfile, uploadProfilePicture };
