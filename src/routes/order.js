const express = require("express");
const { createOrder, getUserOrders } = require("../controller/order");

const router = express.Router();

//create order end point
router.post("/create-order", createOrder);

//get order end point
router.get("/:uid", getUserOrders);

module.exports = router;
