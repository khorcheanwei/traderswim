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
    origin: "http://127.0.0.1:5173",
  })
);
/*
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  next();
});
*/

app.use(express.json());

const redirect_uri = "";

mongoose.connect(process.env.MONGO_URL);

app.get("/test", (req, res) => {
  res.json("test ok");
});

// agent authentication
const agentAccountRoute = require("./routes/agentAccount");
app.use("/agent_account/", agentAccountRoute);

// trading account authentication
const tradingAccount = require("./routes/tradingAccount");
app.use("/trading_account/", tradingAccount);

// manage copy trading account
const copyTradingAccount = require("./routes/copyTradingAccount");
app.use("/copy_trading_account/", copyTradingAccount);

// manage trading stock
const tradingStock = require("./routes/tradingStock");
app.use("/trading_stock/", tradingStock);

var port = process.env.PORT || 4000;
app.listen(port, "127.0.0.1");

// start http server
/*
const httpServer = http.createServer(app);
*/

/*
const bcryptSalt = bcrypt.genSaltSync(12);
const jwtSecret = "12343232324";

require("dotenv").config();

const cors = require("cors");
const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    credentials: true,
    origin: "http://127.0.0.1:5173",
  })
);

mongoose.connect(process.env.MONGO_URL);

app.get("/test", (req, res) => {
  res.json("test ok");
});

app.listen(4000, "127.0.0.1");
*/
