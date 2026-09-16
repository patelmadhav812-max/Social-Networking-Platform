import mongoose from "mongoose";

// Comments Models
const Schema = mongoose.Schema;
const commentSchema = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
  },
  postId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "posts",
  },
  body: {
    type: String,
    required: true,
  },
});

const Comment = mongoose.model("comments", commentSchema);
export default Comment;
