const express = require("express");
const cors = require("cors");
const dns = require("dns");
const cookies_parser = require("cookie-parser");

// Configure DNS before importing the database module
dns.setServers(["8.8.8.8", "8.8.4.4"]);

require("dotenv").config({ path: ".env.production" });

const { UserRoutes } = require("./Router/User.routes");
const { Connection } = require("./Config/db");

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);

app.use(express.json());
app.use(cookies_parser());

app.get("/", (req, res) => {
  res.send("this is server page data????");
});

app.use("/user", UserRoutes);

const PORT = process.env.PORT || process.env.Port || 7000;

async function startServer() {
  try {
    await Connection;
    console.log("DB connected....");

    app.listen(PORT, () => {
      console.log(`Server started....${PORT}`);
    });
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  }
}

startServer();