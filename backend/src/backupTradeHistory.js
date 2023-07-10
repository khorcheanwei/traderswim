

const { copyTradingAccountDBBOperation, tradeHistoryDBOperation } = require("./data-access/index.js");

async function updateTradeHistory() {
    try {
        const orderChainDayForBackup = 3;
        let result = await copyTradingAccountDBBOperation.getAllCopyTradingAccount();
        if (result.success == true) {
            const currentDate = new Date();
            let optionChainTrades = result.data;

            // create copyTradingAccount table
            await copyTradingAccountDBBOperation.deleteAllCopyTradingAccount();

            for(let index = 0; index < optionChainTrades.length; index++) {
                const trade = optionChainTrades[index];
                const enteredTime = new Date(trade["optionChainEnteredTime"]);
                const timeDifference = currentDate.getTime() - enteredTime.getTime();
                const daysDifference = timeDifference / (1000 * 3600 * 24);
              
                if (daysDifference <= orderChainDayForBackup) {
                    await copyTradingAccountDBBOperation.createCopyTradingAccountItem(trade["agentTradingSessionID"], trade);
                } else {
                    await tradeHistoryDBOperation.createtradeHistoryItem(trade["agentTradingSessionID"], trade);
                }
            }
            console.log('Successful update trade history')
        } else {
            console.log(`Update trade history error ${result.error}`)
        }
    } catch (error) {
        console.log(error);
    }
    
}

updateTradeHistory();