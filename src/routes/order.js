const express = require("express");
const { createOrder, getUserOrders } = require("../controller/order");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

//create order end point
router.post("/create-order", authMiddleware, createOrder);

//get order end point
router.get("/:uid", authMiddleware, getUserOrders);

module.exports = router;
