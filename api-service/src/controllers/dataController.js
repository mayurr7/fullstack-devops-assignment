import express from "express";
import User from "../models/userModel.js";
import redisClient from "../utils/redisClient.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/:id", authMiddleware, async (req, res) => {
  try {
    const id = req.params.id.trim(); 

    if (!req.user || !req.user._id) {
      return res.status(401).json({ error: "Unauthorized: Invalid user info" });
    }

    // Normal users can fetch only their own data
    if (req.user.role !== "admin" && req.user._id.toString() !== id) {
      return res.status(403).json({ error: "Access denied" });
    }

    // Check Redis cache
    const cachedData = await redisClient.get(`user:${id}`);
    if (cachedData) {
      return res.json({ source: "cache", data: JSON.parse(cachedData) });
    }

    // Fetch from MongoDB
    const user = await User.findById(id).select("-password");
    if (!user) return res.status(404).json({ error: "User not found" });

    // Store in Redis
    await redisClient.setEx(`user:${id}`, 60, JSON.stringify(user));

    res.json({ source: "db", data: user });
  } catch (err) {
    console.error("GET /data/:id error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
