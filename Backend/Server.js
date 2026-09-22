const express = require("express");

const cors = require("cors");

require("dotenv").config();

const { UserRoutes } = require("./Router/User.routes");
const { Connection } = require("./Config/db");

const app = express();

app.use(express.json());

app.use(
  cors({
    origin: ["*", "http://localhost:5173", "http://localhost:5174"],
  }),
);

app.get("/", (req, res) => {
  res.send("this is server page data????");
});

app.use("/user", UserRoutes);

app.listen(process.env.Port, async () => {
  try {
    await Connection;
    console.log("DB connected....");
  } catch (error) {
    console.log(error);
  } finally {
    console.log(`server started....${process.env.Port}`);
  }
});
