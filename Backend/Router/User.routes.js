const express = require("express");

const { Signup } = require("../Controller/Users.Controller");

const UserRoutes = express.Router();

// all data
UserRoutes.get("/", (req, res) => {
  res.send("this is user page data????");
});

/* 
path : /user/signup

*/

// signup data
UserRoutes.post("/signup", Signup);

module.exports = { UserRoutes };
