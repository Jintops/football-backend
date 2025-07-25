const express = require("express");
require("dotenv").config();
var cookieParser = require("cookie-parser");
const cors = require("cors");
const connectDB = require("./config/database");
const productRouter = require("./routes/product");
const adminRouter = require("./routes/admin");
const userRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const cartRouter = require("./routes/cart");
const orderRouter = require("./routes/order");

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

app.use("/", userRouter);
app.use("/", productRouter);
app.use("/", adminRouter);
app.use("/", profileRouter);
app.use("/", cartRouter);
app.use("/",orderRouter)

connectDB()
  .then(() => {
    console.log("Database connected successfully");
    app.listen(process.env.PORT, () => {
      console.log("app successfully listening");
    });
  })
  .catch((err) => {
    console.error("database connection failed");
  });
