const express = require("express");
const router = express.Router();
const upload = require("../middleware/multerUpload");

const {
  postBook,
  getAllBooks,
  getSingleBook,
  updateBook,
  deleteBook,
  getBooksTable,
} = require("../controller/book");

const verifyUserToken = require("../middleware/verifyUserToken");
const saveRelativePath = require("../middleware/saveRelativePath");

router.get("/", getAllBooks);
router.get("/:id", getSingleBook);
router.post(
  "/create-book",
  upload.single("coverImage"),
  saveRelativePath,
  postBook
);
router.put(
  "/update-book/:id",
  upload.single("coverImage"),
  saveRelativePath,
  updateBook
);
router.delete("/delete-book/:id", verifyUserToken, deleteBook);
router.get("/get-books-table/:page", getBooksTable);

module.exports = router;
