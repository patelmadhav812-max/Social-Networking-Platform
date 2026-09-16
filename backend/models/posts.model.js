import mongoose from "mongoose";
// Post Model
const Schema = mongoose.Schema;
const postSchema = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
  },
  body: {
    type: String,
    required: true,
  },
  like: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  media: {
    type: String,
    default: "",
  },
  fileType: {
    type: String,
    default: "",
  },

  active: {
    type: Boolean,
    default: true,
  },
});

const Post = mongoose.model("posts", postSchema);
export default Post;
