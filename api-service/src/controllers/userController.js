import express from "express";
import User from "../models/userModel.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import { hashPassword, comparePassword } from "../utils/hashPassword.js";
import { generateToken } from "../services/jwtService.js";
import { publishMessage } from "../services/rabbitmqPublisher.js";

const router = express.Router();

// Register
router.post("/register", async (req, res) => {
  try {
    const { username, password, email, role } = req.body;

    // Check existing user
    const existing = await User.findOne({ username });
    if (existing) {
      return res.status(400).json({ error: "User already exists" });
    }

    // Hash password
    const hashed = await hashPassword(password);

    // Create user
    const user = new User({
      username,
      email,
      password: hashed,
      role: role || "user",
    });
    await user.save();

    // Publish event to RabbitMQ (durable message)
    await publishMessage("emailQueue", `Welcome Email Event for ${username}`);

    res.json({
      message: "User registered successfully",
      userId: user._id,
    });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// Login
router.post("/login", async (req, res) => {
  
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ error: "User not found" });

    const valid = await comparePassword(password, user.password);
    if (!valid) return res.status(401).json({ error: "Invalid credentials" });

    const token = generateToken(user);

    res.json({ token });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
