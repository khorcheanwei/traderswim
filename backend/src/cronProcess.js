var cron = require('node-cron');

const { agentDBOperation } = require("./data-access/index.js");
const { account_database_by_agent } = require('./controllers/tradingAccountController.js');
const { copy_trading_database_by_agent } = require('./controllers/copyTradingAccountController.js');
const { copy_trading_position_by_agent } = require('./controllers/copyTradingPositionAccountController.js');

function waitForResult(func, timeout) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      clearTimeout(timer);
      reject(new Error('Function timed out'));
    }, timeout);

    func()
      .then((result) => {
        clearTimeout(timer);
        resolve(result);
      })
      .catch((error) => {
        clearTimeout(timer);
        reject(error);
      });
  });
}

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
      
      // account database by agent
      waitForResult(async () => await account_database_by_agent(agentID), 2000)
        .then((result) => {
          console.log(result); 
        })
        .catch((error) => {
          console.log(error); 
        });

      // copy trading database by agent
      waitForResult(async () => await copy_trading_database_by_agent(agentID), 2000)
        .then((result) => {
          console.log(result); 
        })
        .catch((error) => {
          console.log(error); 
        });

      // copy trading position by agent
      waitForResult(async () => await copy_trading_position_by_agent(agentID), 2000)
        .then((result) => {
          console.log(result); 
        })
        .catch((error) => {
          console.log(error); 
        });
    }
  } catch(error) {
    console.log(error)
  }
});
