const mongoose = require("mongoose");

require("dotenv").config(
    {
        path:".env.production"
    }
);

const Connection = mongoose.connect(process.env.DB);

module.exports = { Connection };
