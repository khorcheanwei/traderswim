
const AccountSchemaSql = `
  CREATE TABLE  IF NOT EXISTS account (
    id INTEGER PRIMARY KEY,
    agentID INTEGER NOT NULL,
    accountId TEXT NOT NULL,
    accountName TEXT NOT NULL,
    accountUsername TEXT NOT NULL,
    accountPassword TEXT NOT NULL,
    accountTradingActive BOOLEAN NOT NULL default true,
    refreshToken TEXT,
    FOREIGN KEY (agentID) REFERENCES agent (id)
);`

module.exports = AccountSchemaSql;