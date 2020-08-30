const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const auth = require("../../middleware/auth.js");

const User = require("../../models/user");
const Post = require("../../models/post");
// const Profile = require("../../models/profile");

//  @route      POST api/posts
//  @desc       Create a post
//  @access     Private
router.post(
  "/",
  [auth, [check("text", "Text is required").not().isEmpty()]],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const user = await User.findById(req.user._id).select("-password");

      const newPost = new Post({
        text: req.body.text,
        name: user.name,
        avatar: user.avatar,
        user: req.user._id,
      });
      await newPost.save();
      res.send(newPost);
    } catch (err) {
      console.log(err.message);
      res.status(500).send("Server error");
    }
  }
);

//  @route      GET api/posts
//  @desc       Get all posts
//  @access     Private
router.get("/", auth, async (req, res) => {
  try {
    const posts = await Post.find().sort({ date: -1 });
    res.send(posts);
  } catch (err) {
    console.log(err.message);
    res.status(500).send("Server Error");
  }
});

//  @route      GET api/posts/:id
//  @desc       Get posts by ID
//  @access     Private
router.get("/:id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).send({ msg: "Post not found" });
    }
    res.send(post);
  } catch (err) {
    console.log(err.message);
    if (err.kind === "ObjectId") {
      return res.status(404).send({ msg: "Post not found" });
    }
    res.status(500).send("Server Error");
  }
});

//  @route      DELETE api/posts/:id
//  @desc       delete a post by id
//  @access     Private
router.delete("/:id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).send({ msg: "Post not found" });
    }

    if (post.user.toString() !== req.user.id) {
      return res.status(401).send({ msg: "User not authorized" });
    }

    await post.remove();
    res.send({ msg: "post removed" });
  } catch (err) {
    console.log(err.message);
    if (err.kind === "ObjectId") {
      return res.status(404).send({ msg: "Post not found" });
    }
    res.status(500).send("Server Error");
  }
});

//  @route      PUT api/posts/like/:id
//  @desc       Like a post
//  @access     Private
router.put("/like/:id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (
      post.likes.filter((like) => like.user.toString() === req.user.id).length >
      0
    ) {
      return res.status(400).send({ msg: "Post already liked" });
    }

    post.likes.unshift({ user: req.user._id });

    await post.save();
    res.send(post.likes);
  } catch (err) {
    console.log(err.message);
    res.status(500).send("Server Error");
  }
});

//  @route      PUT api/posts/unlike/:id
//  @desc       Unlike a post
//  @access     Private
router.put("/unlike/:id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (
      post.likes.filter((like) => like.user.toString() === req.user.id)
        .length === 0
    ) {
      return res.status(400).send({ msg: "Post has not yet been liked" });
    }

    //get remove index
    const removeIndex = post.likes
      .map((like) => like.user.toString())
      .indexOf(req.user.id);

    post.likes.splice(removeIndex, 1);

    await post.save();
    res.send(post.likes);
  } catch (err) {
    console.log(err.message);
    res.status(500).send("Server Error");
  }
});

//  @route      POST api/posts/comment/:id
//  @desc       Comment on a post
//  @access     Private
router.post(
  "/comment/:id",
  [auth, [check("text", "Text is required").not().isEmpty()]],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const user = await User.findById(req.user._id).select("-password");
      const post = await Post.findById(req.params.id);

      const newComment = {
        text: req.body.text,
        name: user.name,
        avatar: user.avatar,
        user: req.user._id,
      };

      post.comments.unshift(newComment);

      await post.save();
      res.send(post.comments);
    } catch (err) {
      console.log(err.message);
      res.status(500).send("Server error");
    }
  }
);

//  @route      POST api/posts/comment/:id/:comment_id
//  @desc       Delete comment on a post
//  @access     Private
router.delete("/comment/:id/:comment_id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    //pull out comment
    const comment = post.comments.find(
      (comment) => comment.id === req.params.comment_id
    );

    //make sure comment exists
    if (!comment) {
      return res.status(404).send({ msg: "Comment does not exist" });
    }

    //check user
    if (comment.user.toString() !== req.user.id) {
      return res.status(401).send({ msg: "user not authorized" });
    }

    //get remove index
    post.comments = post.comments.filter(
      (comment) => comment.id !== req.params.comment_id
    );

    await post.save();
    res.send(post.comments);
  } catch (err) {
    console.log(err.message);
    res.status(500).send("Server error");
  }
});

module.exports = router;
