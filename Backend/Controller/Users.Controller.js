const { UserModel } = require("../Model/User.model");

// signup -> DB

const Signup = async (req, res) => {
  const data = req.body;
  console.log(data);
  const userValue = await UserModel.create(data);

  res.send({ msg: "this is user page data????", userValue });
};

module.exports = { Signup };
