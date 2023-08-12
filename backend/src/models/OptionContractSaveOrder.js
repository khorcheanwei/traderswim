const OptionContractSaveOrderSchemaSql = `
  CREATE TABLE IF NOT EXISTS optionContractSaveOrder (
    id INTEGER PRIMARY KEY,
    agentID INTEGER NOT NULL,
    optionChainSymbol TEXT NOT NULL,
    optionChainDescription TEXT NOT NULL,
    optionChainOrderType TEXT NOT NULL,
    optionChainInstruction TEXT NOT NULL,
    optionChainPrice REAL NOT NULL,
    optionChainQuantity INTEGER NOT NULL,
    FOREIGN KEY (agentID) REFERENCES agent (id),
    UNIQUE (agentID, optionChainSymbol)
);`

module.exports = OptionContractSaveOrderSchemaSql;