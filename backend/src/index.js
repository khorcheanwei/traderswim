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

// socket.io object
//var tradingAccountController = require('./controllers/tradingAccountController');
//tradingAccountController.start(io);

/*
const { tradingAccountCronJob } = require('./controllers/tradingAccountPuppeteer');
// setup cron 
cron.schedule('* * * * *', () => {
  console.log('Trading account cron job task every minute');
  tradingAccountCronJob()
});
*/

app.listen(port, "localhost");

