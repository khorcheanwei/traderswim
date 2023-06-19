const CopyTradingPositionSchemaSql = `
  CREATE TABLE IF NOT EXISTS copyTradingPosition (
    id INTEGER PRIMARY KEY,
    agentID INTEGER NOT NULL,
    optionChainSymbol TEXT NOT NULL,
    FOREIGN KEY (agentID) REFERENCES agent (id)
);`

module.exports = CopyTradingPositionSchemaSql;