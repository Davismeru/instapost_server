const express = require("express");
const validateToken = require("../middlewares/authMiddleware");
const router = express.Router();
const { likes } = require("../models");

router.post("/:postId", validateToken, async (req, res) => {
  const postId = req.params.postId;
  const userId = req.user.id;
  const userHasLiked = await likes.findOne({
    where: { postId: postId, userId: userId },
  });

  if (!userHasLiked) {
    await likes.create({
      postId: postId,
      userId: userId,
    });
    res.json("liked");
  } else {
    await likes.destroy({
      where: { postId: postId, userId: userId },
    });
    res.json("unlike successful");
  }
});

module.exports = router;
