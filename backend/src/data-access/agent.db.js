import bcrypt from "bcryptjs";
const bcryptSalt = bcrypt.genSaltSync(12);

export default function createAgentDB({ Agent }) {
  async function createAgentItem(agentUsername, agentEmail, agentPassword) {
    await Agent.create({
      agentUsername: agentUsername,
      agentEmail: agentEmail,
      agentPassword: bcrypt.hashSync(agentPassword, bcryptSalt),
      agentTradingSessionID: 0,
      agentIsTradingSession: false,
    });
  }

  return Object.freeze({
    createAgentItem,
  });
}
