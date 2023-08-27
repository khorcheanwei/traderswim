const StockSaveOrderSchemaSql = `
  CREATE TABLE IF NOT EXISTS stockSaveOrder (
    id INTEGER PRIMARY KEY,
    agentID INTEGER NOT NULL,
    stockSymbol TEXT NOT NULL,
    stockSession TEXT NOT NULL,
    stockDuration TEXT NOT NULL,    
    stockOrderType TEXT NOT NULL,
    stockInstruction TEXT NOT NULL,
    stockPrice REAL NULL,
    stockStopPrice REAL NULL,
    stockStopPriceLinkType TEXT NULL,
    stockStopPriceOffset REAL NULL,
    stockQuantity INTEGER NOT NULL,
    FOREIGN KEY (agentID) REFERENCES agent (id),
    UNIQUE (agentID, stockSymbol)
);`

module.exports = StockSaveOrderSchemaSql;