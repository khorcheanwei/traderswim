import React from 'react'
import { useContext } from 'react';
import { Button } from './../../shared/Button';
import Overlay from "./../../Overlay";

import StockAllActivePlaceOrder from './../tradingStock/StockAllActivePlaceOrder';
import { StockPlaceOrderContext } from './../context/StockPlaceOrderContext';

export default function TopCopyTradingPage() {

  const { isOpenTradingStock, setIsOpenTradingStock } = useContext(StockPlaceOrderContext);

  const allActivePlaceOrderClose = async () => {
    setIsOpenTradingStock(!isOpenTradingStock)
  }
  
  return (
        <div className="w-full">
            <div className="flex justify-between items-center">
                <div className="flex gap-6 h-12">
                    <Button className="text-gray-700 " onClick={allActivePlaceOrderClose}>BUY/SELL</Button>
                </div>
            </div>
            <div>
                <Overlay isOpen={isOpenTradingStock} >
                    <StockAllActivePlaceOrder onClose={allActivePlaceOrderClose}></StockAllActivePlaceOrder>
                </Overlay>
            </div>
        </div>
  );
}