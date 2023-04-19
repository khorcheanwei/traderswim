const AgentSchemaSql = `
  CREATE TABLE IF NOT EXISTS agent (
    id INTEGER PRIMARY KEY,
    agentUsername TEXT NOT NULL UNIQUE,
    agentPassword TEXT NOT NULL,
    agentTradingSessionID INTEGER NOT NULL,
    agentIsTradingSession BOOLEAN NOT NULL
);`

module.exports = AgentSchemaSql;