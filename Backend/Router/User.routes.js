
const express = require("express");

const { Signup, Login } = require("../Controller/Users.Controller");

const UserRoutes = express.Router();

// Test route
UserRoutes.get("/", (req, res) => {
  res.send("This is user page data");
});

// Signup
UserRoutes.post("/signup", Signup);

// Login
UserRoutes.post("/login", Login);

module.exports = { UserRoutes };
