const { UserModel } = require("../Model/User.model");
require("dotenv").config({});

const { genSalt, hash } = require("bcrypt");

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

const Login = () => {
  // login logic


  /* 
  client side


  server side   
  */
};

module.exports = { Signup, Login };
