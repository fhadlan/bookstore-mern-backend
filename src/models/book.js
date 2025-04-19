const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    author: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    trending: {
      type: Boolean,
      default: false,
    },
    coverImage: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    discount: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
  },
  {
    timestamps: true,
  }
);

bookSchema.virtual("discountedPrice").get(function () {
  return (this.price * (100 - this.discount)) / 100;
});

bookSchema.set("toJSON", { virtuals: true });

const Book = mongoose.model("Book", bookSchema);

module.exports = Book;
