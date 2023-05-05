
const AccountSchemaSql = `
  CREATE TABLE  IF NOT EXISTS account (
    id INTEGER PRIMARY KEY,
    agentID INTEGER NOT NULL,
    accountName TEXT NOT NULL,
    accountUsername TEXT NOT NULL,
    accountPassword TEXT NOT NULL,
    FOREIGN KEY (agentID) REFERENCES agent (id)
);`

module.exports = AccountSchemaSql;