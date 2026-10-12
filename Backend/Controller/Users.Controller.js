const { UserModel } = require("../Model/User.model");
require("dotenv").config({});

const jwt = require("jsonwebtoken");
const { genSalt, hash, compare } = require("bcrypt");

// signup -> DB

const Signup = async (req, res) => {
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
          res.send({ msg: "error in hash", data: err });
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
};

const Login = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("email", email, "plainPass", password);

    if (!email || !password) {
      res.send({ msg: "please provide data and correct credential" });
      return;
    }

    const presentUser = await UserModel.findOne({ email: email });

    if (presentUser.length > 0 || presentUser) {
      // console.log("presentUser", presentUser);

      // login

      const encPass = presentUser.password;
      console.log("encPass", encPass, "myPaass", password);

      compare(password, encPass, (err, result) => {
        if (err) {
          res.send({ msg: "error in compare", data: err });
          return;
        }

        jwt.sign({ course: "xyz" }, process.env.privateKey, (err, decode) => {
          if (err) {
            res.send({ msg: "error found in jwt", data: err });
            return;
          }
          console.log("decode", decode);
        });
      });

      res.send({ msg: presentUser });
      return;
    } else {
      res.send({ msg: "please signup first" });
      return;
    }
  } catch (error) {
    console.log(error);
  }
};

module.exports = { Signup, Login };
