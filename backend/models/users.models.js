import mongoose from "mongoose";
// User Model
const Schema = mongoose.Schema;
const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  profilePicture: {
    type: String,
    default: "defaultProfile.png",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  token: {
    type: String,
    default: "",
  },
  expirytoken: {
    type: Date,
    default: () => new Date(Date.now() + 24 * 60 * 60 * 1000),
  },
});
const User = mongoose.model("users", userSchema);
export default User;
