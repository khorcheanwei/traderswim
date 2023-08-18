const express = require("express");
const router = express.Router();

// router
const agentAccountRouter = require("./agent");

const stockRouter = require("./stockTrading/stock");

const optionContractRouter = require("./optionContract");
const optionContractSaveOrderRouter = require("./optionContractSaveOrder");
const copyTradingAccountRouter = require("./copyTradingAccount");
const copyTradingPositionAccountRouter = require("./copyTradingPositionAccount");
const tradingAccountRouter = require("./tradingAccount");


// router url
router.use("/agent_account", agentAccountRouter);

router.use("/stock", stockRouter);

router.use("/option_contract", optionContractRouter);
router.use("/option_contract_save_order", optionContractSaveOrderRouter);
router.use("/copy_trading_account", copyTradingAccountRouter);
router.use("/copy_trading_position_account", copyTradingPositionAccountRouter);
router.use("/trading_account", tradingAccountRouter);


module.exports = router;
