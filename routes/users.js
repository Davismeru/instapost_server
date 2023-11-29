const express = require("express");
const router = express.Router();
const { users, posts } = require("../models");
const multer = require("multer");
const bcrypt = require("bcryptjs");
const saltRounds = 10;

// profile picture upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads/profilePictures");
  },

  filename: (req, file, cb) => {
    const randomIndex = Math.floor(Math.random() * 10000000000);
    cb(null, randomIndex + file.originalname);
  },
});

const upload = multer({
  storage: storage,
}).single("profilePicture");

// jwt auth
const { sign } = require("jsonwebtoken");

router.post("/login", async (req, res) => {
  const { userName, password } = req.body;

  const user = await users.findOne({ where: { userName: userName } });
  if (!user) {
    res.json({ error: "user doesnt exist" });
  } else {
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      res.json({ error: "incorrect password" });
    } else {
      const accessToken = sign(
        {
          userName: user.userName,
          id: user.id,
          profilePicture: user.profilePicture,
        },
        "security_key"
      );
      res.json(accessToken);
    }
  }
});

router.post("/signup", upload, async (req, res) => {
  const { userName, email, password } = req.body;
  const file = req.file;
  bcrypt.hash(password, saltRounds).then(function (hash) {
    users.create({
      userName: userName,
      email: email,
      password: hash,
      profilePicture: file.path,
    });
  });

  res.send("registration successful");
});

// get user
const validateToken = require("../middlewares/authMiddleware");
router.get("/", validateToken, async (req, res) => {
  const { id, userName, profilePicture } = req.user;
  res.json({ id, userName, profilePicture });
});

// get specific user, exact match for username confirmation during sign up
router.get("/:userName", async (req, res) => {
  const userName = req.params.userName;
  const allUsers = await users.findAll({ where: { userName: userName } });
  const getUser = allUsers.map((user) => {
    return user.userName;
  });

  res.json(getUser);
});

// get specific user, contains same characters for search functionality
router.get("/search/:searchedName", async (req, res) => {
  const searchedName = req.params.searchedName;
  const allUsers = await users.findAll();
  const getUsers = allUsers.filter((user) => {
    if (user.userName.includes(searchedName)) {
      return user;
    }
  });

  // only send the required data to the client
  const eachUser = getUsers.map((user) => {
    const userId = user.id;
    const userName = user.userName;
    const userProfilePicture = user.profilePicture;
    return { userId, userName, userProfilePicture };
  });

  res.json(eachUser);
});

// get specific user by id
router.get("/profile/:userId", async (req, res) => {
  const userId = req.params.userId;
  console.log(userId);
  const user = await users.findOne({
    where: { id: userId },
    include: [posts],
  });
  const userPosts = user.posts;
  const { userName, id, profilePicture, email, createdAt } = user;

  res.json({
    userName,
    id,
    profilePicture,
    email,
    createdAt,
    userPosts,
  });
});

// auth route
router.get("/auth/auth", validateToken, (req, res) => {
  res.json(req.user);
});

module.exports = router;
