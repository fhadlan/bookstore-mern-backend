const express = require("express");
require("dotenv").config();
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");

//routes
const bookRoute = require("./src/routes/book");
const orderRoute = require("./src/routes/order");
const userRoute = require("./src/routes/user");

//server
const app = express();
const port = process.env.PORT || 3000;

//middleware
app.use(express.json());
app.use(
  cors({
    origin: [
      "https://bookstore-mern-frontend-dusky.vercel.app",
      "http://localhost:5173",
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

//routes
app.use("/api/book", bookRoute);
app.use("/api/order", orderRoute);
app.use("/api/user", userRoute);

//security
app.use(helmet());

// // static
// app.use(
//   helmet({
//     crossOriginResourcePolicy: { policy: "cross-origin" },
//     contentSecurityPolicy: {
//       directives: {
//         defaultSrc: ["'self'"],
//         imgSrc: [
//           "'self'",
//           "data:",
//           "https://bookstore-mern-frontend-dusky.vercel.app",
//         ], // Allow images from your server
//       },
//     },
//   })
// );

// app.use(
//   "/uploads/coverImages",
//   (req, res, next) => {
//     if (req.url.includes("..") || req.url.includes(".git")) {
//       return res.status(403).json({ error: "Access Denied" });
//     }
//     next();
//   },
//   express.static("uploads/coverImages")
// );

async function main() {
  await mongoose.connect(process.env.MONGODB_URI);
}

main()
  .then(() => console.log("mongodb connected"))
  .catch((err) => console.log(err));

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
