const express = require("express");
const router = express.Router();

const agentAccountRouter = require("./agent");
const copyTradingAccountRouter = require("./copyTradingAccount");
const tradingAccountRouter = require("./tradingAccount");

router.use("/agent_account", agentAccountRouter);
router.use("/copy_trading_account", copyTradingAccountRouter);
router.use("/trading_account", tradingAccountRouter);

module.exports = router;
