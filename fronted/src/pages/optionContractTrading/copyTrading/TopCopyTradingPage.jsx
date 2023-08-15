import React from 'react'
import { useContext } from 'react';

import TradingStockAllActivePlaceOrder from './../tradingStock/TradingStockAllActivePlaceOrder';
import { OptionContractPlaceOrderContext } from './../context/OptionContractPlaceOrderContext';
import { Button } from './../../shared/Button';
import Overlay from "./../../Overlay";

export default function TopCopyTradingPage() {

  const { isOpenTradingStock, setIsOpenTradingStock } = useContext(OptionContractPlaceOrderContext);

  const allActivePlaceOrderClose = async () => {
    setIsOpenTradingStock(!isOpenTradingStock)
  }
  
  return (
        <div className="w-full">
            <div className="flex justify-between items-center">
                <label className="flex gap-x-2 items-baseline">
                {/*<span className="text-gray-700">Search: </span>
                <input
                    type="text"
                    className="rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    value={value || ""}
                    onChange={e => {
                    setValue(e.target.value);
                    onChange(e.target.value);
                    }}
                    placeholder={`${count} records...`}
                />*/}
                </label> 
                <div className="flex gap-6 h-12">
                    <Button className="text-gray-700 " onClick={allActivePlaceOrderClose}>BUY/SELL</Button>
                </div>
            </div>
            <div>
                <Overlay isOpen={isOpenTradingStock} >
                    <TradingStockAllActivePlaceOrder onClose={allActivePlaceOrderClose}></TradingStockAllActivePlaceOrder>
                </Overlay>
            </div>
        </div>
  );
}