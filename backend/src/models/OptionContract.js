const OptionContractSchemaSql = `
  CREATE TABLE IF NOT EXISTS optionContract (
    id INTEGER PRIMARY KEY,
    agentID INTEGER NOT NULL,
    optionChainSymbol TEXT NOT NULL,
    FOREIGN KEY (agentID) REFERENCES agent (id),
    UNIQUE (agentID, optionChainSymbol)
);`

module.exports = OptionContractSchemaSql;