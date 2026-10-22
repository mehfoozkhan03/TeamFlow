const { UserModel } = require("../Model/User.model");
require("dotenv").config({});

const { genSalt, hash, compare } = require("bcrypt");

const jwt = require("jsonwebtoken");

// signup -> DB

const Signup = async (req, res) => {
  try {
    const { password, ...rest } = req.body;

    console.log("pass", password);
    console.log("process.env.salt", typeof +process.env.salt);

    genSalt(+process.env.salt, async (err, salt) => {
      console.log("salt", salt);
      if (err) {
        res.send({ msg: "error in salt", data: err });
      } else {
        hash(password, salt, async (err, hashPass) => {
          if (err) {
            res.send({ msg: "error in hash? pass must be wrong!", data: err });
          }
          delete req.body.password;
          const finalData = {
            ...rest,
            password: hashPass,
          };
          const userValue = await UserModel.create(finalData);
          res.send({ msg: "this is user page data????", userValue });
        });
      }
    });
  } catch (error) {
    res.send({ msg: "something went wrong in server", error });
  }
};

const Login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).send({
        msg: "Please provide email and password",
      });
    }

    const presentUser = await UserModel.findOne({ email });

    if (!presentUser) {
      return res.status(404).send({
        msg: "Please signup first",
      });
    }

    const result = await compare(password, presentUser.password);

    if (!result) {
      return res.status(401).send({
        msg: "Please enter correct email or password",
      });
    }

    if (!process.env.privateKey) {
      console.error("JWT privateKey is missing from environment variables");

      return res.status(500).send({
        msg: "JWT configuration error",
      });
    }
console.log("JWT key exists:", Boolean(process.env.privateKey));
    const token = jwt.sign(
      {
        userId: presentUser._id,
        email: presentUser.email,
      },
      process.env.privateKey,
      { expiresIn: "1d" }
    );

    return res.status(200).send({
      msg: "Login successful",
      token,
    });
  } catch (error) {
    console.error("Login error:", error.message);

    return res.status(500).send({
      msg: "Something went wrong during login",
    });
  }
};

module.exports = { Signup, Login };
