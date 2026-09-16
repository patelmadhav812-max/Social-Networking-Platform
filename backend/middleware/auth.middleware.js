import User from "../models/users.models.js";

// AuthMiddleware
const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Token required",
      });
    }

    const token = authHeader.split(" ")[1];

    const user = await User.findOne({ token });

    if (!user) {
      return res.status(401).json({
        message: "Invalid token",
      });
    }

    if (new Date() > user.expirytoken) {
      return res.status(401).json({
        message: "Token expired",
      });
    }

    req.user = user;

    next();
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export default authMiddleware;
