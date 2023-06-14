const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
var cron = require('node-cron');

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
const io = require('socket.io')(http);


const { fork } = require("child_process");

fork("./src/cronProcess.js");
/*
var child = spawn("cmd.exe", ["/c", "node", "./src/cronProcess.js"], {
    detached: false,
    stdio: 'ignore'
});*/


app.listen(port, "localhost");

