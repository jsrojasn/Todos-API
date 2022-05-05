const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

const userRoutes = require("../src/routes/auth.js");
const todoRoutes = require("../src/routes/todo.js");
const stripeRoutes = require("../src/routes/stripe.js");
const isAuthenticated = require("../src/middlewares/isAuthenticated");
const isSubscribed = require("../src/middlewares/isSubscribed");

dotenv.config();

mongoose
  .connect(
    process.env.MONGO_URI,
    { useNewUrlParser: true }
  )
  .then(() => {
    const app = express();
    app.use(express.json());
    app.use(cors());
    app.use(express.urlencoded({ extended: false }));
    app.use("/user", userRoutes);
    app.use("/todos", [isAuthenticated, isSubscribed], todoRoutes);
    app.use("/stripe", isAuthenticated ,stripeRoutes);
    app.listen(process.env.PORT || 4000, () => {
      console.log("Server Started");
    });
  });
