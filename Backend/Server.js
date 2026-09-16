const express = require("express");

require("dotenv").config()

const { Connection } = require("./Config/db");

const app = express();

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
