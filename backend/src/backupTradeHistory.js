

const { copyTradingAccountDBBOperation, tradeHistoryDBOperation, stockCopyTradingDBOperation, stockTradeHistoryDBOperation } = require("./data-access/index.js");

async function updateTradeHistory() {
    try {
        const orderChainDayForBackup = 2;
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

async function updateStockTradeHistory() {
    try {
        const stockDayForBackup = 2;
        let result = await stockCopyTradingDBOperation.getAllStockCopyTrading();
        if (result.success == true) {
            const currentDate = new Date();
            let stockTrades = result.data;

            // create stockCopyTrading table
            await stockCopyTradingDBOperation.deleteAllStockCopyTrading();

            for(let index = 0; index < stockTrades.length; index++) {
                const trade = stockTrades[index];
                const enteredTime = new Date(trade["stockEnteredTime"]);
                const timeDifference = currentDate.getTime() - enteredTime.getTime();
                const daysDifference = timeDifference / (1000 * 3600 * 24);
              
                if (daysDifference <= stockDayForBackup) {
                    await stockCopyTradingDBOperation.createStockCopyTradingItem(trade["agentTradingSessionID"], trade);
                } else {
                    await stockTradeHistoryDBOperation.createStockTradeHistoryItem(trade["agentTradingSessionID"], trade);
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
updateStockTradeHistory();