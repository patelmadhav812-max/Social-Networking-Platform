import express from "express";
import React from "react";
import dotenv from "dotenv";
import cors from "cors";
import mongoose, { connect } from "mongoose";
import postRoutes from "./routes/posts.route.js";
import userRoutes from "./routes/user.route.js";
dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
app.use(postRoutes);
app.use(userRoutes);
app.use(express.static("uploads"));
// DataBase Connect
const connectDB = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://kurmimadhav6_db_user:UibMPfZgVFYpynxR@cluste3.sye0int.mongodb.net/?appName=Cluste3",
    );
    console.log("MongoDB connected");
    app.listen(9090, () => {
      console.log("server is listening on port 9090");
    });
  } catch (err) {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  }
};
connectDB();
export default connectDB;
