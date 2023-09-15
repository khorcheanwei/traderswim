import React from "react";
import { useState, useContext } from "react";

import { StockCopyTradingOrderContext } from "../context/StockCopyTradingOrderContext";

import StockDeleteOrder from "../tradingStock/StockDeleteOrder";
import StockReplaceOrder from "../tradingStock/StockReplaceOrder";
import StockCopyTradingAllAccountOrderPage from "../copyTradingOrder/StockCopyTradingAllAccountOrderPage";

import Overlay from "./../../Overlay";
import CommonTable from "./../../shared/Table";
import StockPlaceOrder from "../tradingStock/StockPlaceOrder";

// Define a default UI for filtering
function GlobalFilter({
  preGlobalFilteredRows,
  globalFilter,
  setGlobalFilter,
}) {
  return <div></div>;
}

export function ViewAllOrderPanel(row) {
  const {
    isOpenViewAllOrder,
    setIsOpenViewAllOrder,
    rowCopyTradingOrder,
    setRowCopyTradingOrder,
  } = useContext(StockCopyTradingOrderContext);

  const viewAllOrderClose = async () => {
    if (isOpenViewAllOrder == false) {
      setRowCopyTradingOrder(row);
    }
    setIsOpenViewAllOrder(!isOpenViewAllOrder);
  };

  return (
    <div className="flex">
      <div className="flex space-x-2">
        <div
          onClick={viewAllOrderClose}
          className="cursor-pointer relative inline-flex items-center justify-center w-10 h-10 overflow-hidden rounded-full bg-black"
        >
          <span className="font-medium text-white dark:text-white">V</span>
        </div>
      </div>
      <Overlay isOpen={isOpenViewAllOrder}>
        <StockCopyTradingAllAccountOrderPage
          rowCopyTradingOrder={rowCopyTradingOrder}
          onClose={viewAllOrderClose}
        ></StockCopyTradingAllAccountOrderPage>
      </Overlay>
    </div>
  );
}

export function ChangeOrderPanel(row) {
  const { rowCopyTradingOrder, setRowCopyTradingOrder } = useContext(
    StockCopyTradingOrderContext,
  );
  const [isOpenOrderPlace, setIsOpenOrderPlace] = useState(false);
  const [isOpenOrderReplace, setIsOpenOrderReplace] = useState(false);
  const [isOpenOrderDelete, setIsOpenOrderDelete] = useState(false);

  const orderPlaceClose = async () => {
    if (isOpenOrderPlace == false) {
      setRowCopyTradingOrder(row);
    }
    setIsOpenOrderPlace(!isOpenOrderPlace);
  };

  const orderReplaceClose = async () => {
    if (isOpenOrderReplace == false) {
      setRowCopyTradingOrder(row);
    }
    setIsOpenOrderReplace(!isOpenOrderReplace);
  };

  const orderDeleteClose = async () => {
    if (isOpenOrderDelete == false) {
      setRowCopyTradingOrder(row);
    }
    setIsOpenOrderDelete(!isOpenOrderDelete);
  };

  return (
    <div className="flex">
      <div className="flex space-x-2">
        <div
          onClick={orderPlaceClose}
          className="cursor-pointer relative inline-flex items-center justify-center w-10 h-10 overflow-hidden rounded-full bg-purple-600"
        >
          <span className="font-medium text-white dark:text-white">P</span>
        </div>
        <div
          onClick={orderReplaceClose}
          className="cursor-pointer relative inline-flex items-center justify-center w-10 h-10 overflow-hidden rounded-full bg-yellow-300"
        >
          <span className="font-medium text-white dark:text-white">R</span>
        </div>
        <div
          onClick={orderDeleteClose}
          className="cursor-pointer relative inline-flex items-center justify-center w-10 h-10 overflow-hidden rounded-full bg-middleGreen"
        >
          <span className="font-medium text-white dark:text-white">C</span>
        </div>
      </div>
      <Overlay isOpen={isOpenOrderPlace}>
        <StockPlaceOrder
          rowCopyTradingOrder={rowCopyTradingOrder}
          onClose={orderPlaceClose}
        ></StockPlaceOrder>
      </Overlay>
      <Overlay isOpen={isOpenOrderReplace}>
        <StockReplaceOrder
          rowCopyTradingOrder={rowCopyTradingOrder}
          onClose={orderReplaceClose}
        ></StockReplaceOrder>
      </Overlay>
      <Overlay isOpen={isOpenOrderDelete}>
        <StockDeleteOrder
          rowCopyTradingOrder={rowCopyTradingOrder}
          onClose={orderDeleteClose}
          isOpenOrderDelete={isOpenOrderDelete}
          setIsOpenOrderDelete={setIsOpenOrderDelete}
        ></StockDeleteOrder>
      </Overlay>
    </div>
  );
}

export function StockStatusColorPanel(row) {
  <span className="font-medium text-white dark:text-white">R</span>;

  let stockStatusColor = row.cell.row.original.stockStatusColor;

  let stockStatusColorCss =
    " text-xs font-medium mr-2 px-2.5 py-0.5 rounded-full";

  if (stockStatusColor == "green") {
    stockStatusColorCss = "bg-green-500 " + stockStatusColorCss;
  } else if (stockStatusColor == "red") {
    stockStatusColorCss = "bg-red-500 " + stockStatusColorCss;
  } else {
    stockStatusColorCss = "bg-purple-500 " + stockStatusColorCss;
  }

  return (
    <div>
      <span className={stockStatusColorCss}></span>
    </div>
  );
}

function StockCopyTradingOrderTable({ columns, data }) {
  let hiddenColumns = [
    "accountId",
    "stockOrderId",
    "agentTradingSessionID",
    "stockStopPrice",
    "stockStopPriceLinkType",
    "stockStopPriceOffset",
  ];
  return CommonTable({ columns, data, GlobalFilter, hiddenColumns });
}

export default StockCopyTradingOrderTable;
