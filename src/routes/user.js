const express = require("express");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const { changePassword, updateProfile } = require("../controller/user");
const authMiddleware = require("../middleware/authMiddleware");
const upload = require("../middleware/multerUpload");

const jwt_secret = process.env.JWT_SECRET;

const router = express.Router();

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).send("User not found");
    }
    if (user.password !== password) {
      return res.status(401).send("Invalid password");
    }
    const token = jwt.sign(
      { id: user._id, email: user.email, isAdmin: user.isAdmin },
      jwt_secret,
      { expiresIn: "1d" }
    );
    return res.status(200).json({
      message: "Login successful",
      token: token,
      user: { name: user.name, isAdmin: user.isAdmin },
    });
  } catch (error) {
    res.status(500).send("something went wrong");
  }
});

router.post("/change-password", changePassword);
router.post(
  "/update-profile",
  authMiddleware,
  upload.single("photo"),
  updateProfile
);

module.exports = router;
