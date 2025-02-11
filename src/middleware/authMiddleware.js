const admin = require("../firebase/firebaseAdmin");

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      console.log("this triggered");
      return res.status(401).json({ error: "Unauthorized" });
    }
    const token = authHeader.split(" ")[1];
    console.log("token", token);
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = decodedToken;
    next();
  } catch (error) {
    return res
      .status(401)
      .json({ error: "Unauthorized", message: error.message });
  }
};

module.exports = authMiddleware;
