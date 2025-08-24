import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "No token provided" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Fetch user from DB (optional) or just use decoded payload
    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return res.status(401).json({ error: "Invalid token: user not found" });
    }

    req.user = user; 
    next();
  } catch (err) {
    console.error("AuthMiddleware error:", err);
    return res.status(401).json({ error: "Unauthorized" });
  }
};

export default authMiddleware;
