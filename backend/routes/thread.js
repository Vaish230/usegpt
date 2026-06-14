import { Router } from "express";
import Thread from "../models/thread.js";
import getGROQ from "../utils/GROQ.js";
import jwt from "jsonwebtoken";
import User from "../models/user.js";

const router = Router();

router.post("/test", async (req, res) => {
  try {
    const thread = new Thread({
      threadId: "tert",
      title: "teywrqyu",
    });
    const response = await thread.save();
    res.send(response);
  } catch (e) {
    console.log(e);
  }
});

router.get("/thread", async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.startsWith("Bearer ") ? authHeader.split(" ")[1] : null;
    if (!token || token === "null" || token === "undefined") {
      return res.status(401).json({ error: "Unauthorized. Please log in." });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const threads = await Thread.find({ userId: decoded.id }).sort({
      updatedDate: -1,
    });
    res.json(threads);
  } catch (err) {
    console.log(err);
    res.status(401).json({ error: "Session expired or invalid. Please log in again." });
  }
});

router.get("/thread/:threadId", async (req, res) => {
  const { threadId } = req.params;
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.startsWith("Bearer ") ? authHeader.split(" ")[1] : null;
    if (!token || token === "null" || token === "undefined") {
      return res.status(401).json({ error: "Unauthorized. Please log in." });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const thread = await Thread.findOne({ threadId, userId: decoded.id });
    if (!thread) {
      return res.status(404).json({ error: "Thread not found" });
    }
    res.json(thread);
  } catch (e) {
    console.log(e);
    res.status(401).json({ error: "Session expired or invalid. Please log in again." });
  }
});

router.delete("/thread/:threadId", async (req, res) => {
  const { threadId } = req.params;
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.startsWith("Bearer ") ? authHeader.split(" ")[1] : null;
    if (!token || token === "null" || token === "undefined") {
      return res.status(401).json({ error: "Unauthorized. Please log in." });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const thread = await Thread.findOneAndDelete({
      threadId,
      userId: decoded.id,
    });
    if (!thread) {
      return res.status(404).json({ error: "Thread not found" });
    }
    res.status(200).json({ success: "Thread Deleted" });
  } catch (e) {
    console.log(e);
    res.status(401).json({ error: "Session expired or invalid. Please log in again." });
  }
});

router.post("/chat", async (req, res) => {
  const { threadId, message } = req.body;
  if (!threadId || !message) {
    return res.status(400).json({ error: "Missing Fields" });
  }

  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.startsWith("Bearer ") ? authHeader.split(" ")[1] : null;
    
    let userId = null;
    if (token && token !== "null" && token !== "undefined") {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        userId = decoded.id;
      } catch (err) {
        return res.status(401).json({ error: "Session expired. Please log in again." });
      }
    }

    const assistantReply = await getGROQ(message);

    if (userId) {
      let thread = await Thread.findOne({ threadId, userId });
      if (!thread) {
        thread = new Thread({
          userId,
          threadId,
          title: message.slice(0, 40),
          messages: [{ role: "user", content: message }],
        });
      } else {
        thread.messages.push({ role: "user", content: message });
      }
      thread.messages.push({ role: "assistant", content: assistantReply });
      thread.updatedDate = new Date();
      await thread.save();
    }

    res.json({ reply: assistantReply });
  } catch (e) {
    console.log(e);
    res.status(500).json({ error: "Something went wrong" });
  }
});

export default router;
