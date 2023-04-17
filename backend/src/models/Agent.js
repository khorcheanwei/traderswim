const AgentSchemaSql = `
  CREATE TABLE IF NOT EXISTS agents (
    id INTEGER PRIMARY KEY,
    agentUsername TEXT NOT NULL UNIQUE,
    agentEmail TEXT NOT NULL UNIQUE,
    agentPassword TEXT NOT NULL,
    agentTradingSessionID INTEGER NOT NULL,
    agentIsTradingSession BOOLEAN NOT NULL
);`

module.exports = AgentSchemaSql;