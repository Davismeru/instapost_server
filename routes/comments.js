const express = require("express");
const router = express.Router();
const { comments } = require("../models");
const validateToken = require("../middlewares/authMiddleware");

router.get("/:postId", async (req, res) => {
  const postId = req.params.postId;
  const { orderBy = "createdAt", sortBy = "desc" } = req.query;
  const allComments = await comments.findAll({
    where: { postId: postId },
    order: [[orderBy, sortBy]],
  });
  res.json(allComments);
});

router.post("/", validateToken, async (req, res) => {
  const { comment, postId } = req.body;
  const { userName, profilePicture } = req.user;
  await comments.create({
    comments: comment,
    userName: userName,
    profilePicture: profilePicture,
    postId: postId,
  });
  res.json("success");
});

module.exports = router;
