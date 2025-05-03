const { default: mongoose } = require("mongoose");
const Book = require("../models/book");
const Order = require("../models/order");

const createOrder = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { cartItems, userId, name, email, address, phone } = req.body;
    const bookIds = cartItems.map((item) => item._id);
    const books = await Book.find({ _id: { $in: bookIds } });

    const bulkOps = [];
    const items = cartItems.map((item) => {
      const book = books.find((book) => book._id.toString() === item._id);

      if (!book) {
        throw new Error("Book not found");
      }

      if (book.quantity < item.quantity) {
        throw new Error("Book out of stock");
      }

      bulkOps.push({
        updateOne: {
          filter: { _id: book._id, quantity: { $gte: item.quantity } },
          update: { $inc: { quantity: -item.quantity } },
        },
      });

      return {
        productId: book._id,
        quantity: item.quantity,
        priceAtOrder: book.discountedPrice,
        total: (book.discountedPrice * item.quantity).toFixed(1),
      };
    });

    console.log(req.body);
    await Book.bulkWrite(bulkOps, { session });
    const order = await Order.create({
      userId,
      name,
      email,
      address,
      phone,
      items,
    });
    await session.commitTransaction();
    res.status(200).json(order);
  } catch (error) {
    await session.abortTransaction();
    console.log(error);
    res.status(500).send(error.message);
  } finally {
    session.endSession();
  }
};

const getUserOrders = async (req, res) => {
  try {
    const { uid, page } = req.params;

    const orders = await Order.find({ userId: uid })
      .populate("items.productId", "title")
      .skip((page - 1) * 10)
      .limit(10)
      .sort({ createdAt: -1 });
    const count = await Order.countDocuments({ userId: uid });
    const totalPages = Math.ceil(count / 10);
    !orders && res.status(404).send("You have no orders");
    console.log(orders[0].items);
    res.status(200).json({ orders, totalPages });
  } catch (error) {
    console.log(error);
    res.status(500).send("something went wrong");
  }
};

const cancelOrder = async (req, res) => {
  const { _id } = req.params;
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    const order = await Order.findById(_id).session(session);
    if (!order) throw new Error("Order not found");

    if (order.status === "cancelled") {
      throw new Error("Order already cancelled");
    }
    const bulkOps = order.items.map((item) => ({
      updateOne: {
        filter: { _id: item.productId },
        update: { $inc: { quantity: item.quantity } },
      },
    }));

    await Book.bulkWrite(bulkOps, { session });

    order.status = "cancelled";
    await order.save({ session });

    await session.commitTransaction();
    res.status(200).send({ message: "Order canceled successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).send("something went wrong");
  } finally {
    session.endSession();
  }
};

const manageOrders = async (req, res) => {
  try {
    const { page, status, id } = req.query;
    const filter = {};
    status && (filter.status = status);
    id && (filter._id = id);
    const orders = await Order.find(filter)
      .sort({ createdAt: -1 })
      .populate("productsId", "title newPrice")
      .skip((page - 1) * 10)
      .limit(10)
      .sort({ createdAt: -1 });
    const count = await Order.countDocuments();
    const totalPages = Math.ceil(count / 10);
    res.status(200).json({ orders, totalPages });
  } catch (error) {
    console.log(error);
    res.status(500).send("something went wrong");
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const updatedOrder = await Order.findByIdAndUpdate(id, { status });
    !updatedOrder && res.status(404).send("Order doesn't exist");
    res.status(200).send({ message: "Order status updated successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).send("something went wrong");
  }
};

module.exports = {
  createOrder,
  getUserOrders,
  cancelOrder,
  manageOrders,
  updateOrderStatus,
};
