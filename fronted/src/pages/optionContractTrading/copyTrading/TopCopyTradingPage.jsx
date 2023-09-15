import React from "react";
import { useState } from "react";

import TradingStockAllActivePlaceOrder from "./../tradingStock/TradingStockAllActivePlaceOrder";
import { Button } from "./../../shared/Button";
import Overlay from "./../../Overlay";

export default function TopCopyTradingPage() {
  const [isOpenTradingStock, setIsOpenTradingStock] = useState(false);

  const allActivePlaceOrderClose = async () => {
    setIsOpenTradingStock(!isOpenTradingStock);
  };

  return (
    <div className="w-full">
      <div className="flex justify-end items-center">
        <div className="flex gap-6 h-12">
          <Button className="text-gray-700 " onClick={allActivePlaceOrderClose}>
            BUY/SELL
          </Button>
        </div>
      </div>
      <div>
        <Overlay isOpen={isOpenTradingStock}>
          <TradingStockAllActivePlaceOrder
            onClose={allActivePlaceOrderClose}
          ></TradingStockAllActivePlaceOrder>
        </Overlay>
      </div>
    </div>
  );
}
