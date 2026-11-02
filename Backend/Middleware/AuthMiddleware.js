const jwt = require("jsonwebtoken");
<<<<<<< HEAD
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
=======
require("dotenv").config({
  path:".env.production"
});

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
>>>>>>> be13fa5a83feb27c88be43725d76d999c683a214
    });
  }
};

<<<<<<< HEAD
module.exports = { AuthMiddleware };
=======
module.exports = { protect };
>>>>>>> be13fa5a83feb27c88be43725d76d999c683a214
