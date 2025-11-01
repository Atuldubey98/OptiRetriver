import app from "./app";
import mongoose from "mongoose";
import http from "http";
import dotenv from 'dotenv';

dotenv.config();

http.createServer(app).listen(3000, () => {  
  mongoose.connect(process.env.MONGODB_URL || "").then(() => {
    console.log("Connected to MongoDB");
  }).catch(err => {
    console.error("Failed to connect to MongoDB", err);
  });
  console.log("Server is running on port 3000");
});