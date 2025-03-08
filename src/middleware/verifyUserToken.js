const jwt = require("jsonwebtoken");

const jwt_secret = process.env.JWT_SECRET;

const verifyUserToken = (req, res, next) => {
  const token = req.cookies.adminToken;

  if (!token) {
    return res.status(401).send("Unauthorized");
  }

  try {
    const decoded = jwt.verify(token, jwt_secret);
    req.user = decoded;
  } catch (err) {
    return res.status(401).send("Invalid Token");
  }
  return next();
};

module.exports = verifyUserToken;
