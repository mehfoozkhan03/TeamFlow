const express = require("express");

const { Signup, Login } = require("../Controller/Users.Controller");

const UserRoutes = express.Router();

// all data
UserRoutes.get("/", (req, res) => {
  res.send("this is user page data????");
});

/* 
path : /user/signup

url http://localhost:7000//user/signup
*/

// signup data
UserRoutes.post("/signup", Signup);

// login
UserRoutes.post("/login", Login);

module.exports = { UserRoutes };
