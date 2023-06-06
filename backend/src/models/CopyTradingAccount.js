const CopyTradingAccountSchemaSql = `
  CREATE TABLE IF NOT EXISTS copyTradingAccount (
    id INTEGER PRIMARY KEY,
    agentID INTEGER NOT NULL,
    agentTradingSessionID INTEGER NOT NULL,
    accountId INTEGER NOT NULL,
    accountName TEXT NOT NULL,
    accountUsername TEXT NOT NULL,
    optionChainSymbol TEXT NOT NULL,
    optionChainDescription TEXT NOT NULL,
    optionChainOrderId INTEGER NOT NULL,
    optionChainOrderType TEXT NOT NULL,
    optionChainInstruction TEXT NOT NULL,
    optionChainPrice REAL NOT NULL,
    optionChainQuantity INTEGER NOT NULL,
    optionChainRemainingQuantity INTEGER NOT NULL,
    optionChainStatus TEXT NOT NULL,
    optionChainEnteredTime DATETIME NOT NULL,
    FOREIGN KEY (agentID) REFERENCES agent (id),
    FOREIGN KEY (accountId) REFERENCES account (id)
);`

module.exports = CopyTradingAccountSchemaSql;
