const express = require("express");
const router = express.Router();
const { Comment } = require("../models/Comment");

const { auth } = require("../middleware/auth");

//=================================
//             Subscribe
//=================================

router.post("/saveComment", async (req, res) => {
  try {
    const newComment = new Comment(req.body);
    const comment = await newComment.save();
    const result = await Comment.findById(comment._id).populate("writer");

    if (!result) {
      return res.json({ success: false, err });
    }
    return res.status(200).json({ success: true, result });
  } catch (err) {
    return res.json({ success: false, err });
  }
});

router.post("/getComments", (req, res) => {
  Comment.find({ postId: req.body.videoId })
    .populate("writer")
    .exec((err, comments) => {
      if (err) return res.status(400).send(err);
      res.status(200).json({ success: true, comments });
    });
});

module.exports = router;
