const express = require("express");
require("dotenv").config();
const mongoose = require("mongoose");
const app = express();
const port = process.env.PORT || 3000;

//routes
const bookRoute = require("./src/routes/book");
app.use("/api/book", bookRoute);

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
