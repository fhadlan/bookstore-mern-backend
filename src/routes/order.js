const express = require("express");
const { createOrder, getAllOrdersEmail } = require("../controller/order");

const router = express.Router();

//create order end point
router.post("/create-order", createOrder);

//get order end point
router.get("/:uid", getAllOrdersEmail);

module.exports = router;
