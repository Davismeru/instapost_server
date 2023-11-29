const express = require("express");
const cors = require("cors");
const app = express();
const path = require("path");
require("dotenv").config();

app.use(express.json());
app.use(cors());

const db = require("./models");
const { Sequelize, DataTypes } = require("sequelize");

// users router
const usersRouter = require("./routes/users");
app.use("/users", usersRouter);

// posts router
const postRouter = require("./routes/posts");
app.use("/posts", postRouter);

// comments router
const commentsRouter = require("./routes/comments");
app.use("/comments", commentsRouter);

// likes router
const likesRouter = require("./routes/likes");
app.use("/likes", likesRouter);

app.use("/uploads", express.static("uploads"));

db.sequelize.sync().then(() => {
  app.listen(process.env.PORT || 3000, () => {
    console.log("server running");
  });
});
