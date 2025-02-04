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
    const { uid } = req.params;
    const orders = await Order.find({ userId: uid }).populate(
      "productsId",
      "title newPrice"
    );
    !orders && res.status(404).send("You have no orders");
    res.status(200).send(orders);
  } catch (error) {
    console.log(error);
    res.status(500).send("something went wrong");
  }
};

module.exports = {
  createOrder,
  getUserOrders,
};
