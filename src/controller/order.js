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

const getAllOrdersEmail = async (req, res) => {};

module.exports = {
  createOrder,
  getAllOrdersEmail,
};
