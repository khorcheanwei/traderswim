const express = require("express");
const agentAccountRouter = require("./agentAccount");

const router = express.Router();

router.use("/agent_account", agentAccountRouter);

module.exports = router;
