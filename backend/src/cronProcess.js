var cron = require('node-cron');

const { agentDBOperation } = require("./data-access/index.js");
const { account_database_by_agent } = require('./controllers/tradingAccountController.js');
const { copy_trading_database_by_agent } = require('./controllers/copyTradingAccountController.js');
const { copy_trading_position_by_agent } = require('./controllers/copyTradingPositionAccountController.js');


// setup cron 


cron.schedule('*/2 * * * * *', async () => {
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
