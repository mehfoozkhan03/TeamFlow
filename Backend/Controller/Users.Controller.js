<<<<<<< HEAD

const { UserModel } = require("../Model/User.model");
=======
const { UserModel } = require("../Model/user.model");
>>>>>>> be13fa5a83feb27c88be43725d76d999c683a214
require("dotenv").config({});

const { genSalt, hash, compare } = require("bcrypt");
const jwt = require("jsonwebtoken");

// SIGNUP: Create a new user in the database
const Signup = async (req, res) => {
  try {
    const { password, ...rest } = req.body;

    console.log("pass", password);
    console.log("process.env.salt", typeof +process.env.salt);

    genSalt(+process.env.salt, async (err, salt) => {
      console.log("salt", salt);

      if (err) {
        return res.status(500).send({
          msg: "Error generating salt",
        });
      }

      hash(password, salt, async (err, hashPass) => {
        if (err) {
          return res.status(500).send({
            msg: "Error hashing password",
          });
        }

        try {
          const finalData = {
            ...rest,
            password: hashPass,
          };

          const userValue = await UserModel.create(finalData);

          return res.status(201).send({
            msg: "Signup successful",
            userValue,
          });
        } catch (error) {
          return res.status(500).send({
            msg: "Something went wrong during signup",
          });
        }
      });
    });
  } catch (error) {
    return res.status(500).send({
      msg: "Something went wrong on the server",
    });
  }
};

// LOGIN: Verify credentials and generate a JWT token
const Login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        msg: "Please provide email and password",
      });
    }

    const presentUser = await UserModel.findOne({ email });

    if (!presentUser) {
      return res.status(404).json({
        msg: "Please signup first",
      });
    }

    const result = await compare(password, presentUser.password);

    if (!result) {
      return res.status(401).json({
        msg: "Please enter correct email or password",
      });
    }

    if (!process.env.privateKey) {
      console.error("JWT privateKey is missing from environment variables");

      return res.status(500).json({
        msg: "JWT configuration error",
      });
    }

    const token = jwt.sign(
      {
        userId: presentUser._id,
        email: presentUser.email,
      },
      process.env.privateKey,
      { expiresIn: "1d" },
    );

    return res
      .cookie("token", token, {
        httpOnly: false,
        secure: false,
        sameSite: "Lax",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })
      .status(200)
      .json({
        msg: "Login successful",
        user: {
          id: presentUser._id,
          email: presentUser.email,
          token,
        },
      });
  } catch (error) {
    console.error("Login error:", error.message);

    return res.status(500).json({
      msg: "Something went wrong during login",
    });
  }
};

// GET ME: Fetch the currently logged-in user's details
const GetMe = async (req, res) => {
  try {
    const user = await UserModel.findById(req.user.userId).select("-password");

    if (!user) {
      return res.status(404).json({
        msg: "User not found",
      });
    }

    return res.status(200).json({
      msg: "User details fetched successfully",
      user,
    });
  } catch (error) {
    return res.status(500).json({
      msg: "Failed to fetch user details",
    });
  }
};

module.exports = { Signup, Login, GetMe };
