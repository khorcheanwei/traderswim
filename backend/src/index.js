const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");

// security
const corsOptions = {
  origin: "127.0.0.1",
  credentials: true,
  optionSuccessStatus: 200,
};

require("dotenv").config();

// setup express
const app = express();
app.use(cookieParser());
app.use(
  cors({
    credentials: true,
    origin: "http://localhost:5173",
  })
);

app.use(express.json());

const redirect_uri = "";

mongoose.connect(process.env.MONGO_URL);

const router = require("./routes/index");
app.use(router);

var port = process.env.PORT || 4000;
module.exports = app.listen(port, "localhost");
