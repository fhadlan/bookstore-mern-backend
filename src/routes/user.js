const express = require("express");
const {
  changePassword,
  updateProfile,
  login,
  getAdmin,
  adminLogout,
  createUser,
  changePasswordAdmin,
  getUsers,
  patchAdminStatus,
  deleteUser,
} = require("../controller/user");
const authMiddleware = require("../middleware/authMiddleware");
const verifyUserToken = require("../middleware/verifyUserToken");
const upload = require("../middleware/multerUpload");

const router = express.Router();
//admin user
router.post("/login", login);
router.post("/logout", verifyUserToken, adminLogout);

router.get("/dashboard", verifyUserToken, getAdmin);
router.get("/users", verifyUserToken, getUsers);
router.post("/create-user", verifyUserToken, createUser);
router.put("/change-password-admin", verifyUserToken, changePasswordAdmin);
router.patch("/patch-admin-status/:id", verifyUserToken, patchAdminStatus);
router.delete("/delete-user/:id", verifyUserToken, deleteUser);

//customer user
router.post("/change-password", changePassword);

router.post(
  "/update-profile",
  authMiddleware,
  upload.single("photo"),
  updateProfile
);

module.exports = router;
