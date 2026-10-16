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
  // login logic

  try {
    const { email, password } = req.body;

    // db compare

    const data = await UserModel.find({ email: email });
    console.log("🚀 ~ Login ~ data:", data);

    if (data.length > 0) {
      // code

       compare(password, data?.password,process.env.salt,  function(err, decode){
        if (err) console.log("err in compare", err);

        console.log("decoded", decode);
      });
    } else {
      res.send({ msg: "please signup first ", token });
    }
  } catch (error) {
    res.send({ msg: "something went wrong in server", error });
    // throw Error()
  }

  /* 
  client side


  server side   
  */
};

module.exports = { Signup, Login };
