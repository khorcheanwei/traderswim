const StockSaveOrderSchemaSql = `
  CREATE TABLE IF NOT EXISTS stockSaveOrder (
    id INTEGER PRIMARY KEY,
    agentID INTEGER NOT NULL,
    stockSymbol TEXT NOT NULL,
    stockOrderType TEXT NOT NULL,
    stockInstruction TEXT NOT NULL,
    stockPrice REAL NOT NULL,
    stockQuantity INTEGER NOT NULL,
    FOREIGN KEY (agentID) REFERENCES agent (id),
    UNIQUE (agentID, stockSymbol)
);`

module.exports = StockSaveOrderSchemaSql;