require("dotenv").config();
const admin = require("../firebase/firebaseAdmin");
const { getAuth } = require("firebase-admin/auth");
const cloudinary = require("cloudinary").v2;
const streamifier = require("streamifier");
const bcrypt = require("bcrypt");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const jwt_secret = process.env.JWT_SECRET;

//cloudinary config

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: "Invalid Credential" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid password" });

    const token = jwt.sign(
      { id: user._id, email: user.email, isAdmin: user.isAdmin },
      jwt_secret,
      { expiresIn: "1h" }
    );

    res.cookie("adminToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "none",
      path: "/",
      maxAge: 60 * 60 * 1000,
    });

    res.status(200).json({
      message: "Login successful",
      token: token,
      user: { name: user.name, isAdmin: user.isAdmin },
    });
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const getAdmin = async (req, res) => {
  //for admin authentication check in frontend
  res.status(200).json({ message: "Admin dashboard" });
};

const adminLogout = async (req, res) => {
  res.clearCookie("adminToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "none",
    path: "/",
  });
  res.status(200).json({ message: "Logout successful" });
};

const changePassword = async (req, res) => {
  const { uid, currentPassword, newPassword } = req.body;
  try {
    await getAuth().updateUser(uid, {
      password: newPassword,
    });
    res.json({ message: "Password changed successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

const updateProfile = async (req, res) => {
  const { uid } = req.body;
  const user = await admin.auth().getUser(uid);
  const cloudinaryBaseURL = "https://res.cloudinary.com/";
  const profileData = {
    displayName: req.body.displayName,
  };
  try {
    if (req.file) {
      //console.log(user.photoURL);
      if (user.photoURL.startsWith(cloudinaryBaseURL)) {
        const getPublicId = (url) => {
          const parts = url.split("/");
          const filename = parts[parts.length - 1];
          return parts[parts.length - 2] + "/" + filename.split(".")[0];
        };
        const publicId = getPublicId(user.photoURL);
        await cloudinary.uploader.destroy(publicId);
      }
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: "profile" },
        async (error, result) => {
          profileData.photoURL = result.secure_url;
          await getAuth().updateUser(uid, profileData);
          error && console.log(error);
        }
      );
      streamifier.createReadStream(req.file.buffer).pipe(uploadStream);
      res.json({ message: "Profile updated successfully" });
    } else {
      await getAuth().updateUser(uid, {
        displayName,
      });
      res.json({ message: "Profile updated successfully" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  changePassword,
  updateProfile,
  login,
  getAdmin,
  adminLogout,
};
