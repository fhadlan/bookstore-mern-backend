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
  bannerImage,
  searchBook,
} = require("../controller/book");

const verifyUserToken = require("../middleware/verifyUserToken");

router.get("/", getAllBooks);
router.get("/book/:id", getSingleBook);
router.post(
  "/create-book",
  verifyUserToken,
  upload.single("coverImage"),
  postBook
);
router.put(
  "/update-book/:id",
  verifyUserToken,
  upload.single("coverImage"),
  updateBook
);
router.delete("/delete-book/:id", verifyUserToken, deleteBook);
router.get("/get-books-table/:page", verifyUserToken, getBooksTable);
router.get("/banner/banner-image", bannerImage);
router.get("/search", searchBook);

module.exports = router;
