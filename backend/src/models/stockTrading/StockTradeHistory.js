const StockTradeHistorySchemaSql = `
  CREATE TABLE IF NOT EXISTS stockTradeHistory (
    id INTEGER PRIMARY KEY,
    agentID INTEGER NOT NULL,
    agentTradingSessionID INTEGER NOT NULL,
    accountId INTEGER NOT NULL,
    accountName TEXT NOT NULL,
    accountUsername TEXT NOT NULL,
    stockSymbol TEXT NOT NULL,
    stockOrderId INTEGER NOT NULL,
    stockOrderType TEXT NOT NULL,
    stockInstruction TEXT NOT NULL,
    stockPrice REAL NOT NULL,
    stockQuantity INTEGER NOT NULL,
    stockFilledQuantity INTEGER NOT NULL,
    stockStatus TEXT NOT NULL,
    stockEnteredTime DATETIME NOT NULL,
    FOREIGN KEY (agentID) REFERENCES agent (id),
    FOREIGN KEY (accountId) REFERENCES account (id)
);`

module.exports = StockTradeHistorySchemaSql;
