const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

require("dotenv").config();

const app = express();
app.use(cookieParser());
app.use(
  cors({
    credentials: true,
    origin: "http://localhost:3000",
  })
);
app.use(express.json());


// setup router
const router = require("./routes/index");
app.use(router);

let port = process.env.PORT || 4000;

const http = require('http').Server(app);

// cronjob
const { fork } = require("child_process");
fork("./src/cronAccountProcess.js");
fork("./src/cronOptionCopyTradingProcess.js");
fork("./src/cronStockCopyTradingProcess.js");


// trade history
require("./backupTradeHistory.js");

app.listen(port, "localhost");

