import mongoose from "mongoose";
// Connection Model
const schema = mongoose.Schema;
const connectionSchema = new schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
  },
  connectionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
  },
  status_accepted: {
    type: Boolean,
    default: null,
  },
});
const Connection = mongoose.model("connections", connectionSchema);
export default Connection;
