import mongoose from "mongoose";

const Schema = mongoose.Schema;
// EducationSchema
const educationSchema = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
  },
  school: {
    type: String,
    required: true,
  },
  degree: {
    type: String,
    required: true,
  },
  fieldOfStudy: {
    type: String,
    default: "",
  },
});
const Education = mongoose.model("education", educationSchema);
// WorkSchema
const workSchema = new Schema({
  company: {
    type: String,
    default: "",
  },
  position: {
    type: String,
    default: "",
  },
  years: {
    type: String,
    default: "",
  },
});
const work = mongoose.model("work", workSchema);
// ProfileSchema
const profileSchema = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
  },
  bio: {
    type: String,
    default: "",
  },
  currentPost: {
    type: String,
    default: "",
  },
  pastWork: {
    type: [workSchema],
    default: [],
  },
  education: {
    type: [educationSchema],
    default: [],
  },
});
const Profile = mongoose.model("Profile", profileSchema);
export { Profile, Education, work };
