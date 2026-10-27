const jwt = require("jsonwebtoken");
require("dotenv").config();

const protect = (req, res, next) => {
  try {
    // 1. Get Authorization header
    const authHeader = req.headers.authorization;

    // 2. Check Bearer token
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        msg: "Access denied. Token required",
      });
    }

    // 3. Extract token
    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        msg: "Token is missing",
      });
    }

    // 4. Check JWT secret
    if (!process.env.privateKey) {
      return res.status(500).json({
        success: false,
        msg: "JWT configuration error",
      });
    }

    // 5. Verify JWT
    const decoded = jwt.verify(
      token,
      process.env.privateKey
    );

    // 6. Attach user to request
    req.user = decoded;

    // 7. Continue to controller
    next();

  } catch (error) {
    if (
      error.name === "JsonWebTokenError" ||
      error.name === "TokenExpiredError" ||
      error.name === "NotBeforeError"
    ) {
      return res.status(401).json({
        success: false,
        msg: "Invalid or expired token",
      });
    }

    return res.status(500).json({
      success: false,
      msg: "Authentication failed",
    });
  }
};

module.exports = { protect };