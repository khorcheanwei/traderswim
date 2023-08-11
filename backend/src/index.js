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

// cronjob
const { fork } = require("child_process");
fork("./src/cronProcess.js");

// backup trade history
require("./backupTradeHistory.js");

console.log('WebSocket server running on port 8080');

app.listen(port, "localhost");

