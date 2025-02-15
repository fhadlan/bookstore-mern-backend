const admin = require("../firebase/firebaseAdmin");
const { getAuth } = require("firebase-admin/auth");
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

module.exports = { changePassword };
