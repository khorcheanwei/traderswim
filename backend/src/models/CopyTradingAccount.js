const CopyTradingAccountSchemaSql = `
  CREATE TABLE IF NOT EXISTS copyTradingAccount (
    id INTEGER PRIMARY KEY,
    agentID INTEGER NOT NULL,
    agentTradingSessionID INTEGER NOT NULL,
    accountID INTEGER NOT NULL,
    accountName TEXT NOT NULL,
    accountUsername TEXT NOT NULL,
    optionChainSymbol TEXT NOT NULL,
    optionChainAction TEXT NOT NULL,
    optionChainType TEXT NOT NULL,
    optionContractPrice REAL NOT NULL,
    stockEntryPriceCurrency TEXT NOT NULL,
    orderQuantity INTEGER NOT NULL,
    filledQuantity INTEGER NOT NULL,
    orderDate DATETIME NOT NULL,
    FOREIGN KEY (agentID) REFERENCES agent (id),
    FOREIGN KEY (accountID) REFERENCES account (id)
);`

module.exports = CopyTradingAccountSchemaSql;
