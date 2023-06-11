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

const { agentDBOperation } = require("./data-access/index.js");
const { account_database_by_agent } = require('./controllers/tradingAccountController');
const { copy_trading_database_by_agent } = require('./controllers/copyTradingAccountController');
const { copy_trading_position_by_agent } = require('./controllers/copyTradingPositionAccountController');
// setup cron 
cron.schedule('*/3 * * * * *', async () => {
  console.log('Trading account cron job task every 2 seconds');
  const queryResult = await agentDBOperation.searchAllAgentID();
  let agent_list = [];
  for (let index = 0; index < queryResult.data.length; index++) {
    agent_list.push(queryResult.data[index]["id"])
  }

  try {
    for (let index = 0; index < agent_list.length; index++) {
      const agentID = agent_list[index];
      await account_database_by_agent(agentID);
      await copy_trading_database_by_agent(agentID);
      const copyTradingPositionDataDict = await copy_trading_position_by_agent(agentID);
      console.log(copyTradingPositionDataDict)
    }
  } catch(error) {
    console.log(error)
  }
});


app.listen(port, "localhost");

