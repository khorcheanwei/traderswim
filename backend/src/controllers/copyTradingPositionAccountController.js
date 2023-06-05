const axios = require('axios');
const jwt = require("jsonwebtoken");
const node_cache = require("node-cache");
const cache = new node_cache();

const jwtSecret = "traderswim";

const {
  agentDBOperation,
  accountDBOperation,
  copyTradingAccountDBBOperation,
} = require("../data-access/index.js");

const { puppeteer_login_account, get_access_token_from_cache, fetch_trading_account_info_api } = require("./tradingAccountPuppeteer.js")

// Copy trading position database
async function copy_trading_position_database(httpRequest) {
  const { token } = httpRequest.cookies;

  if (token) {
    try {
      let agentDocument = jwt.verify(token, jwtSecret, {});
      agentID = agentDocument.id;

      // get agent trading sessionID
      let result = await agentDBOperation.searchAgentTradingSessionID(agentID);
      if (result.success != true) {
        return { success: false, data: result.error };
      }
      agentDocument = result.data;
      const agentTradingSessionID = agentDocument.agentTradingSessionID;

      /*
      // sync order and save to copy trading table for all trading accounts
      await sync_order_and_save_to_copy_trading_database(agentID, agentTradingSessionID)

      // get CopyTradingAccount based on agentID and agentTradingSessionID
      result =
        await copyTradingAccountDBBOperation.searchCopyTradingAccountBasedTradingSessionID(
          agentID,
          agentTradingSessionID
        );

      if (result.success != true) {
        return { success: false, data: result.error };
      }
      const copyTradingAccountDocument = result.data;

      let copyTradingAccountData = [];
      for (let index = 0; index < copyTradingAccountDocument.length; index++) {
        const currCopyTradingAccount = copyTradingAccountDocument[index];
        copyTradingAccountData.push({
          accountName: currCopyTradingAccount.accountName,
          accountUsername: currCopyTradingAccount.accountUsername,
          optionChainEnteredTime: currCopyTradingAccount.optionChainEnteredTime,
          optionChainInstruction: currCopyTradingAccount.optionChainInstruction,
          optionChainQuantity: currCopyTradingAccount.optionChainQuantity,
          optionChainFilledQuantity: currCopyTradingAccount.optionChainFilledQuantity,
          optionChainDescription: currCopyTradingAccount.optionChainDescription,
          optionChainPrice: currCopyTradingAccount.optionChainPrice,
          optionChainOrderType: currCopyTradingAccount.optionChainOrderType,
          optionChainStatus: currCopyTradingAccount.optionChainStatus,
        });
      }

      //await new Promise(resolve => setTimeout(resolve, 500)); 
      return { success: true, data: copyTradingAccountData };
      */
    } catch (error) {
      return { success: false, data: error.message };
    }
  } else {
    return { success: true, data: null };
  }
}

module.exports = {
    copy_trading_position_database,
};
