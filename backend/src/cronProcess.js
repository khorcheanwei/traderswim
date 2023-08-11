var cron = require('node-cron');

const { agentDBOperation } = require("./data-access/index.js");
const { account_database_by_agent, account_database_websocket } = require('./controllers/tradingAccountController.js');
const { copy_trading_database_by_agent } = require('./controllers/copyTradingAccountController.js');
const { copy_trading_position_by_agent } = require('./controllers/copyTradingPositionAccountController.js');

// websocket and store connected clients in an array
const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8080 });
const clients = [];

wss.on('connection', (ws) => {
  console.log('New WebSocket connection established');

  // Add the new client to the clients array
  clients.push(ws);

  ws.on('message', (message) => {
    console.log('Received message:', message);
  });

  ws.on('close', () => {
    console.log('WebSocket connection closed');
    // Remove the client from the clients array when the connection is closed
    const index = clients.indexOf(ws);
    if (index !== -1) {
      clients.splice(index, 1);
    }
  });
});

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
  console.log('Trading account cron job task every 1 seconds');
  const queryResult = await agentDBOperation.searchAllAgentID();
  let agent_list = [];
  for (let index = 0; index < queryResult.data.length; index++) {
    agent_list.push(queryResult.data[index]["id"])
  }

  try {
    for (let index = 0; index < agent_list.length; index++) {
      const agentID = agent_list[index];

      // get account database when there is in cache, if not call account_database_by_agent
      waitForResult(async () => await account_database_websocket(agentID), 2000)
        .then((result) => {
          clients.forEach((client) => {
            client.send(JSON.stringify(result));
          });
        })
        .catch((error) => {
          console.log(error); 
        });

  
      // update latest account database into cache
      waitForResult(async () => await account_database_by_agent(agentID), 2000)
        .then((result) => {
        })
        .catch((error) => {
          console.log(error); 
        });

      /*
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
      */
    }
  } catch(error) {
    console.log(error)
  }
});
