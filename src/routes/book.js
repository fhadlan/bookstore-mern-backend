const express = require("express");
const router = express.Router();

const {
  postBook,
  getAllBooks,
  getSingleBook,
  updateBook,
  deleteBook,
  getBooksTable,
} = require("../controller/book");

const verifyUserToken = require("../middleware/verifyUserToken");

router.get("/", getAllBooks);
router.get("/:id", getSingleBook);
router.post("/create-book", verifyUserToken, postBook);
router.put("/update-book/:id", verifyUserToken, updateBook);
router.delete("/delete-book/:id", verifyUserToken, deleteBook);
router.get("/get-books-table/:page", getBooksTable);

module.exports = router;
