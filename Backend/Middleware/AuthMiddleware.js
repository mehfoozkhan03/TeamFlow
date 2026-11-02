const jwt = require("jsonwebtoken");
require("dotenv").config();

// Verify the JWT token before allowing access to protected routes
const AuthMiddleware = (req, res, next) => {
  try {
    const token = req.cookies?.token;

    if (!token) {
      return res.status(401).json({
        msg: "Please login first",
      });
    }

    const decoded = jwt.verify(token, process.env.privateKey);

    req.user = decoded;

    next();
  } catch (error) {
    return res.status(401).json({
      msg: "Invalid or expired token. Please login again.",
    });
  }
};

module.exports = { AuthMiddleware };