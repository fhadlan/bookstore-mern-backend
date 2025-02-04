const express = require("express");
require("dotenv").config();
const mongoose = require("mongoose");
const cors = require("cors");

const bookRoute = require("./src/routes/book");
const orderRoute = require("./src/routes/order");

const app = express();
const port = process.env.PORT || 3000;

//middleware
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

//routes
app.use("/api/book", bookRoute);
app.use("/api/order", orderRoute);

async function main() {
  await mongoose.connect(process.env.MONGODB_URI);
  app.use("/", (req, res) => {
    res.send("hello worlds");
  });
}

main()
  .then(() => console.log("mongodb connected"))
  .catch((err) => console.log(err));

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
