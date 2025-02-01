const express = require("express");
const router = express.Router();

const {
  postBook,
  getAllBooks,
  getSingleBook,
  updateBook,
  deleteBook,
} = require("../controller/book");

router.get("/", getAllBooks);
router.get("/:id", getSingleBook);
router.post("/create-book", postBook);
router.put("/update-book/:id", updateBook);
router.delete("/delete-book/:id", deleteBook);

module.exports = router;
