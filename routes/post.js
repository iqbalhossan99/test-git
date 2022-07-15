const router = require("express").Router();
const Post = require("../models/Post");
const { ObjectId } = require("mongodb");

// CREATE POST
router.post("", async (req, res) => {
  try {
    const query = req?.body;
    const newPost = new Post(query);

    const post = await newPost.save();

    res.status(200).json(post);
  } catch (err) {
    res.status(500).json(err);
    console.log(err);
  }
});

// GET ALL POST
router.get("/", async (req, res) => {
  try {
    const query = {};
    const posts = await Post.find(query);
    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json(err);
    console.log(err);
  }
});

// GET SINGLE POST BY ID
router.get("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const query = { _id: ObjectId(id) };

    const post = await Post.findById(query);

    res.status(200).json(post);
  } catch (err) {
    res.status(500).json(err);
    console.log(err);
  }
});

// DELETE POST BY ID
router.delete("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const query = { _id: ObjectId(id) };

    await Post.findByIdAndDelete(query);
    res.status(200).json("The Post has been deleted!");
  } catch (err) {
    res.status(500).json(err);
    console.log(err);
  }
});

// UPDATE THE POST
router.put("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const query = { _id: ObjectId(id) };

    const updatePost = await Post.findByIdAndUpdate(query, {
      $set: req.body,
    });
    res.status(200).json(updatePost);
  } catch (err) {
    res.status(500).json(err);
    console.log(err);
  }
});

//LIKE / DISLIKE A POST

// router.put("/:id/like", async (req, res) => {
//   try {
//     const { id } = req.params.id;
//     const post = await Post.findById(id);
//     if (!post.likes.includes(req.body.userId)) {
//       await post.updateOne({ $push: { likes: req.body.userId } });
//       res.status(200).json("The post has been liked");
//     } else {
//       await post.updateOne({ $pull: { likes: req.body.userId } });
//       res.status(200).json("The post has been disliked");
//     }
//   } catch (err) {
//     res.status(500).json(err);
//   }
// });

// UPDATE COMMENT
router.put("/:id/comment", async (req, res) => {
  try {
    const id = req.params.id;
    const query = { _id: ObjectId(id) };
    const comment = req.body.comments;

    const postComment = await Post.findByIdAndUpdate(
      query,
      {
        $push: { comments: req.body },
      },
      { new: true }
    );
    res.status(200).json(postComment);
  } catch (err) {
    res.status(500).json(err);
    console.log(err);
  }
});

// Get uer posts
router.get("/userposts/:email", async (req, res) => {
  try {
    const email = req.params.email;
    const query = { email: email };
    const userPosts = await Post.find(query);
    res.status(200).json(userPosts);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
