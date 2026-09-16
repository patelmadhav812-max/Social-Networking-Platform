import { Router } from "express";
import {
  activeCheck,
  commentPost,
  createPost,
  deleteComment_Of_User,
  deletePost,
  get_comments_by_posts,
  getPost,
  incrementLike,
} from "../controller/posts.controller.js";
import multer from "multer";
const router = Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage: storage });
router.route("/").get(activeCheck);
// Create Post route
router.route("/post").post(upload.single("media"), createPost);
// Get post Route
router.route("/posts").get(getPost);
// Delete Post Route
router.route("/delete_Post").delete(deletePost);
// Create Comment Route
router.route("/comment").post(commentPost);
// Get Comment Route
router.route("/get_comments").get(get_comments_by_posts);
// Delete Comment
router.route("/delete_comment").delete(deleteComment_Of_User);
// Increment Post Like
router.route("/increment_post_like").post(incrementLike);
export default router;
