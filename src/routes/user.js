const express = require("express");
const {
  changePassword,
  updateProfile,
  login,
  getAdmin,
  adminLogout,
} = require("../controller/user");
const authMiddleware = require("../middleware/authMiddleware");
const verifyUserToken = require("../middleware/verifyUserToken");
const upload = require("../middleware/multerUpload");

const router = express.Router();

router.post("/login", login);
router.post("/logout", verifyUserToken, adminLogout);

router.get("/dashboard", verifyUserToken, getAdmin);

router.post("/change-password", changePassword);

router.post(
  "/update-profile",
  authMiddleware,
  upload.single("photo"),
  updateProfile
);

module.exports = router;
