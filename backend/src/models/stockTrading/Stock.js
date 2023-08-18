const StockSchemaSql = `
  CREATE TABLE IF NOT EXISTS stock (
    id INTEGER PRIMARY KEY,
    agentID INTEGER NOT NULL,
    stockSymbol TEXT NOT NULL,
    FOREIGN KEY (agentID) REFERENCES agent (id),
    UNIQUE (agentID, stockSymbol)
);`

module.exports = StockSchemaSql;