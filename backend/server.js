console.log("SERVER LOADED");
import OpenAI from "openai";
import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import chatRoutes from "./routes/thread.js";
import authRoutes from "./routes/auth.js";
import threadRoutes from "./routes/thread.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  console.log("REQUEST:", req.method, req.url);
  next();
});

app.use("/api", authRoutes);
app.use("/api", chatRoutes);

const port = process.env.PORT || 5000;

app.use((req, res, next) => {
  console.log("HIT:", req.method, req.url);
  next();
});

const mongodb = async () => {
  try {
    await mongoose.connect(process.env.MONGO_DB);
    console.log("Successfully connected to DB");
  } catch (e) {
    console.log("Some error occurred", e);
  }
};

app.get("/", (req, res) => {
  res.send("Server running");
});

app.listen(port, async () => {
  console.log(`Listening to Port ${port}`);
  await mongodb()
});

console.log("Reached end of file");
