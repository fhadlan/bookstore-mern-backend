const Book = require("../models/book");

const postBook = async (req, res) => {
  try {
    const newBook = await Book({ ...req.body });
    await newBook.save();
    res.status(200).send({ message: "data added successfully", data: newBook });
  } catch (error) {
    console.log(error);
    res.status(500).send("something went wrong");
  }
};

const getAllBooks = async (req, res) => {
  try {
    const books = await Book.find();
    res.status(200).send({ data: books });
  } catch (error) {
    console.log(error);
    res.status(500).send("something went wrong");
  }
};

const getSingleBook = async (req, res) => {
  try {
    const { id } = req.params;
    const book = await Book.findById(id);
    !book && res.status(404).send("book doesn't exist");
    res.status(200).send({ data: book });
  } catch (error) {
    console.log(error);
    res.status(500).send("something went wrong");
  }
};

const updateBook = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedBook = await Book.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    !updatedBook && res.status(404).send("book doesn't exist");
    res
      .status(200)
      .send({ message: "book data updated successfully", data: updatedBook });
  } catch (error) {
    console.log(error);
    res.status(500).send("something went wrong");
  }
};

const deleteBook = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedBook = await Book.findByIdAndDelete(id);
    !deletedBook && res.status(404).send("book doesn't exist");
    res
      .status(200)
      .send({ message: "book deleted successfully", data: deletedBook });
  } catch (error) {
    console.log(error);
    res.status(500).send("something went wrong");
  }
};

module.exports = {
  postBook,
  getAllBooks,
  getSingleBook,
  updateBook,
  deleteBook,
};
