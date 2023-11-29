const express = require("express");
const router = express.Router();
const { posts, likes, comments } = require("../models");

// posts image upload
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads/postImages");
  },

  filename: (req, file, cb) => {
    const randomIndex = Math.floor(Math.random() * 10000000000);
    cb(null, randomIndex + file.originalname);
  },
});

const upload = multer({
  storage: storage,
}).array("postPictures");

router.get("/", async (req, res) => {
  const { page, limit = 10, orderBy = "id", sortBy = "desc" } = req.query;
  const allPosts = await posts.findAndCountAll({
    limit,
    offset: page * limit,
    include: [likes, comments],
    order: [[orderBy, sortBy]],
    distinct: true, // not include joined tables data in the count
  });

  const data = allPosts.rows;
  const totalPages = Math.ceil(allPosts.count / limit);
  res.json({ totalPages, data });
});

// get single post
router.get("/:postId", async (req, res) => {
  const postId = req.params.postId;
  const singlePost = await posts.findOne({
    where: { id: postId },
    include: [likes, comments],
  });
  res.json(singlePost);
});

// get single user all posts
router.get("/profile/:userId", async (req, res) => {
  const userId = req.params.userId;
  const userPosts = await posts.findAll({
    where: { userId: userId },
    include: [likes, comments],
  });
  res.json(userPosts);
});

const validateToken = require("../middlewares/authMiddleware");

router.post("/", upload, validateToken, async (req, res) => {
  const post = req.body;
  const files = req.files;
  const { id, userName, profilePicture } = req.user;
  const arr = [];
  for (let i = 0; i < files.length; i++) {
    arr.push(files[i].path);
  }
  await posts.create({
    postText: post.postText,
    postPictures: arr.toString(),
    userId: id,
    userName: userName,
    profilePicture: profilePicture,
  });

  res.json("success");
});

module.exports = router;
