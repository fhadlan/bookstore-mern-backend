const Book = require("../models/book");
const path = require("path");
const fs = require("fs");
const cloudinary = require("cloudinary").v2;
const streamifier = require("streamifier");

//cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const postBook = async (req, res) => {
  try {
    const { title, description, category, trending, oldPrice, newPrice } =
      req.body;

    const newBook = new Book({
      title,
      description,
      category,
      trending: trending === "true" ? true : false,
      oldPrice,
      newPrice,
    });

    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: "coverImage" },
      async (error, result) => {
        newBook.coverImage = result.secure_url;
        await newBook.save();
        error && console.log(error);
      }
    );

    streamifier.createReadStream(req.file.buffer).pipe(uploadStream);
    res.status(200).send({ message: "data added successfully", data: newBook });
  } catch (error) {
    console.log(error);
    res.status(500).send("something went wrong");
  }
};

const getAllBooks = async (req, res) => {
  try {
    const books = await Book.find();
    res.status(200).send(books);
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
    res.status(200).send(book);
  } catch (error) {
    console.log(error);
    res.status(500).send("something went wrong");
  }
};

const updateBook = async (req, res) => {
  try {
    const { id } = req.params;
    const bookData = {
      title: req.body.title,
      description: req.body.description,
      category: req.body.category,
      trending: req.body.trending === "true" ? true : false,
      oldPrice: req.body.oldPrice,
      newPrice: req.body.newPrice, // Handle file uploads
    };

    const book = await Book.findById(id);
    if (req.file) {
      const getPublicId = (url) => {
        const parts = url.split("/");
        const filename = parts[parts.length - 1]; // "book-1.png"
        return parts[parts.length - 2] + "/" + filename.split(".")[0]; // "bookstore_covers/book-1"
      };
      const publicId = getPublicId(book.coverImage);
      await cloudinary.uploader.destroy(publicId);
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: "coverImage" },
        async (error, result) => {
          bookData.coverImage = result.secure_url;
          const updatedBook = await Book.findByIdAndUpdate(id, bookData, {
            new: true,
          });
          !updatedBook && res.status(404).send("book doesn't exist");

          res.status(200).json({
            message: "book data updated successfully",
            data: updatedBook,
          });
          error && console.log(error);
        }
      );
      streamifier.createReadStream(req.file.buffer).pipe(uploadStream);
    } else {
      bookData.coverImage = book.coverImage;
      const updatedBook = await Book.findByIdAndUpdate(id, bookData, {
        new: true,
      });
      !updatedBook && res.status(404).send("book doesn't exist");
      res
        .status(200)
        .send({ message: "book data updated successfully", data: updatedBook });
    }
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

    const getPublicId = (url) => {
      const parts = url.split("/");
      const filename = parts[parts.length - 1]; // "book-1.png"
      return parts[parts.length - 2] + "/" + filename.split(".")[0]; // "bookstore_covers/book-1"
    };

    const publicId = getPublicId(deletedBook.coverImage);

    await cloudinary.uploader.destroy(publicId);
    res
      .status(200)
      .json({ message: "book deleted successfully", data: deletedBook });
  } catch (error) {
    console.log(error);
    res.status(500).send("something went wrong");
  }
};

const getBooksTable = async (req, res) => {
  try {
    const { page } = req.params;
    const books = await Book.find()
      .skip((page - 1) * 10)
      .limit(10);
    const count = await Book.countDocuments();
    const totalPages = Math.ceil(count / 10);
    res.status(200).send({ books, totalPages });
  } catch (error) {
    console.log(error);
    res.status(500).send("something went wrong");
  }
};

const bannerImage = async (req, res) => {
  try {
    const book = await Book.find().sort({ createdAt: -1 }).limit(3);
    res.status(200).json(book);
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  postBook,
  getAllBooks,
  getSingleBook,
  updateBook,
  deleteBook,
  getBooksTable,
  bannerImage,
};
