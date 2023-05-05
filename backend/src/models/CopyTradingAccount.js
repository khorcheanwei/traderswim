const CopyTradingAccountSchemaSql = `
  CREATE TABLE IF NOT EXISTS copyTradingAccount (
    id INTEGER PRIMARY KEY,
    agentID INTEGER NOT NULL,
    agentTradingSessionID INTEGER NOT NULL,
    accountID INTEGER NOT NULL,
    accountName TEXT NOT NULL,
    accountUsername TEXT NOT NULL,
    stockName TEXT NOT NULL,
    stockTradeAction TEXT NOT NULL,
    stockTradeType TEXT NOT NULL,
    stockEntryPrice REAL NOT NULL,
    stockEntryPriceCurrency TEXT NOT NULL,
    orderQuantity INTEGER NOT NULL,
    filledQuantity INTEGER NOT NULL,
    orderDate DATETIME NOT NULL,
    FOREIGN KEY (agentID) REFERENCES agent (id),
    FOREIGN KEY (accountID) REFERENCES account (id)
);`

module.exports = CopyTradingAccountSchemaSql;
