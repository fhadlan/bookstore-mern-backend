const path = require("path");
const saveRelativePath = (req, res, next) => {
  if (req.file) {
    req.file.path = path.relative(process.cwd(), req.file.path); // Convert absolute to relative path
  }
  next();
};

module.exports = saveRelativePath;
