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
    await mongoose.connect(process.env.ATLAS_URL);

    console.log("MongoDB connected");

    app.listen(process.env.PORT || 9090, () => {
      console.log("server is listening");
    });
  } catch (err) {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  }
};
connectDB();
export default connectDB;
