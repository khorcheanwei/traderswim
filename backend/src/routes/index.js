const express = require("express");
const router = express.Router();

const agentAccountRouter = require("./agent");
const copyTradingAccountRouter = require("./copyTradingAccount");
const copyTradingPositionAccountRouter = require("./copyTradingPositionAccount");
const tradingAccountRouter = require("./tradingAccount");
const optionContractRouter = require("./optionContract");
const optionContractSaveOrderRouter = require("./optionContractSaveOrder");

router.use("/agent_account", agentAccountRouter);
router.use("/copy_trading_account", copyTradingAccountRouter);
router.use("/copy_trading_position_account", copyTradingPositionAccountRouter);
router.use("/trading_account", tradingAccountRouter);
router.use("/option_contract", optionContractRouter);
router.use("/option_contract_save_order", optionContractSaveOrderRouter);

module.exports = router;
