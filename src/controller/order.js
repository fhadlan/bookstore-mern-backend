const Order = require("../models/order");

const createOrder = async (req, res) => {
  try {
    const newOrder = await Order({ ...req.body });
    const savedOrder = await newOrder.save();
    res
      .status(200)
      .send({ message: "Order created successfully", data: savedOrder });
  } catch (error) {
    console.log(error);
    res.status(500).send("something went wrong");
  }
};

const getUserOrders = async (req, res) => {
  try {
    const { uid, page } = req.params;

    const orders = await Order.find({ userId: uid })
      .populate("productsId", "title newPrice")
      .skip((page - 1) * 10)
      .limit(10)
      .sort({ createdAt: -1 });
    const count = await Order.countDocuments({ userId: uid });
    const totalPages = Math.ceil(count / 10);
    !orders && res.status(404).send("You have no orders");
    res.status(200).json({ orders, totalPages });
  } catch (error) {
    console.log(error);
    res.status(500).send("something went wrong");
  }
};

const cancelOrder = async (req, res) => {
  try {
    const { _id } = req.params;
    const canceledOrder = await Order.findByIdAndUpdate(_id, {
      status: "cancelled",
    });
    !canceledOrder && res.status(404).send("Order doesn't exist");
    res.status(200).send({ message: "Order canceled successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).send("something went wrong");
  }
};

const manageOrders = async (req, res) => {
  try {
    const { page } = req.params;
    const orders = await Order.find()
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

module.exports = {
  createOrder,
  getUserOrders,
  cancelOrder,
  manageOrders,
};
