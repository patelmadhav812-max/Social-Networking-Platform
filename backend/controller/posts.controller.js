import Post from "../models/posts.model.js";
import User from "../models/users.models.js";
import Comment from "../models/comments.models.js";
export const activeCheck = (req, res) => {
  return res.status(200).json({ message: "active" });
};
// Create Post Controller
export const createPost = async (req, res) => {
  const { token } = req.body;
  try {
    const user = await User.findOne({ token });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const post = new Post({
      userId: user._id,
      body: req.body.body,
      media: req.file != undefined ? req.file.filename : "",
      fileType: req.file != undefined ? req.file.mimetype.split("/")[1] : "",
    });
    await post.save();
    return res.status(200).json({ message: "Post is created" });
  } catch (e) {
    return res.status(500).json({ message: e.message });
  }
};
// Get Post controller
export const getPost = async (req, res) => {
  try {
    const posts = await Post.find({}).populate(
      "userId",
      "name username email profilePicture",
    );
    return res.json({ posts });
  } catch (e) {
    return res.status(500).json({ message: e.message });
  }
};
// DeletePost Controller
export const deletePost = async (req, res) => {
  const { token, post_id } = req.body;
  try {
    const user = await User.findOne({ token }).select("_id");
    if (!user) {
      return res.status(404).json({ message: "User not Found" });
    }
    const post = await Post.findOne({ _id: post_id });
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    if (post.userId.toString() !== user._id.toString()) {
      return res.status(401).json({ message: " Unauthorized" });
    }
    await Post.deleteOne({ _id: post_id });
    return res.json({ message: "Post delete" });
  } catch (e) {
    return res.status(500).json({ message: e.message });
  }
};

// CommentPost Controller
export const commentPost = async (req, res) => {
  const { token, post_id, commentBody } = req.body;
  try {
    const user = await User.findOne({ token }).select("_id");
    if (!user) {
      return res.status(404).json({ message: "User not Found" });
    }
    const post = await Post.findOne({ _id: post_id });
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    const comment = new Comment({
      userId: user._id,
      postId: post_id,
      body: commentBody,
    });
    await comment.save();
    return res.status(200).json({ message: "comment successfully" });
  } catch (e) {
    return res.status(500).json({ message: e.message });
  }
};

// Get Comments By posts Controller
export const get_comments_by_posts = async (req, res) => {
  const { post_id } = req.query;
  try {
    const post = await Post.findOne({ _id: post_id });
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    const comments = await Comment.find({ postId: post_id }).populate(
      "userId",
      "username name profilePicture",
    );
    return res.json(comments.reverse());
  } catch (e) {
    return res.status(500).json({ message: e.message });
  }
};

// Delete Comment Controller
export const deleteComment_Of_User = async (req, res) => {
  const { token, comment_id } = req.body;
  try {
    const user = await User.findOne({ token }).select("_id");
    if (!user) {
      return res.status(404).json({ message: "User not Found" });
    }
    const comment = await Comment.findOne({ _id: comment_id });
    if (!comment) {
      return res.status(401).json({ message: "Comment not found" });
    }
    if (comment.userId.toString() !== user._id.toString()) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    await Comment.deleteOne({ _id: comment_id });
    return res.json({ message: "comment deleted" });
  } catch (e) {
    return res.status(500).json({ message: e.message });
  }
};
// IncrementLike Controller

export const incrementLike = async (req, res) => {
  const { post_id } = req.body;
  try {
    const post = await Post.findById(post_id);
    if (!post) {
      return res.status(404).json({ message: "post not found" });
    }
    post.like = post.like + 1;
    await post.save();
    return res.json({ message: "Like is increase" });
  } catch (e) {
    return res.status(500).json({ message: e.message });
  }
};
