const admin = require("../firebase/firebaseAdmin");
const { getAuth } = require("firebase-admin/auth");
const cloudinary = require("cloudinary").v2;
const streamifier = require("streamifier");

//cloudinary config

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

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

module.exports = { changePassword, updateProfile };
