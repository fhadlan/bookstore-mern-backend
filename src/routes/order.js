const express = require("express");
const {
  createOrder,
  getUserOrders,
  cancelOrder,
  manageOrders,
} = require("../controller/order");
const authMiddleware = require("../middleware/authMiddleware");
const verifyUserToken = require("../middleware/verifyUserToken");

const router = express.Router();

//create order end point
router.post("/create-order", authMiddleware, createOrder);

//get order end point
router.get("/:uid/:page", authMiddleware, getUserOrders);

//cancel order
router.put("/cancel-order/:_id", authMiddleware, cancelOrder);

//manage order
router.get("/manage-order", verifyUserToken, manageOrders);

module.exports = router;
