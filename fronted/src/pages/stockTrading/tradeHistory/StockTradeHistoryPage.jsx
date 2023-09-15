import axios from "axios";
import React from "react";
import { useContext, useState, useEffect } from "react";
import { StockTradeHistoryContext } from "../context/StockTradeHistoryContext";
import StockTradeHistoryTable from "./StockTradeHistoryTable";

export default function StockTradeHistoryPage() {
  const columns = React.useMemo(
    () => [
      {
        Header: "ID",
        accessor: "agentTradingSessionID",
      },
      {
        Header: "Symbol description",
        accessor: "stockDescription",
      },
      {
        Header: "Filled Qty",
        accessor: "stockFilledQuantity",
      },
      {
        Header: "Price",
        accessor: "stockPrice",
      },
      {
        Header: "Qty",
        accessor: "stockQuantity",
      },
      {
        Header: "Side Pos Effect",
        accessor: "stockInstruction",
      },
      {
        Header: "Status",
        accessor: "stockStatus",
      },
      {
        Header: "Order type",
        accessor: "stockOrderType",
      },
      {
        Header: "Time",
        accessor: "stockEnteredTime",
      },
      {
        Header: "Name",
        accessor: "accountName",
      },
      {
        Header: "Account Username",
        accessor: "accountUsername",
      },
    ],
    [],
  );

  const { stockTradeHistoryTableData, setStockTradeHistoryTableData } =
    useContext(StockTradeHistoryContext);

  async function fetchTradeHistoryData() {
    try {
      const response = await axios.get(
        "/stock_copy_trading/trade_history_database",
      );

      if (response.data != null) {
        setStockTradeHistoryTableData(response.data);
      }
    } catch (error) {
      console.log(error.message);
    }
  }

  useEffect(() => {
    fetchTradeHistoryData();
  }, []);

  var data = React.useMemo(
    () => stockTradeHistoryTableData,
    [stockTradeHistoryTableData],
  );

  return (
    <div className="min-h-screen bg-gray-100 text-black">
      <main className="mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <div className="mt-6">
          <StockTradeHistoryTable columns={columns} data={data} />
        </div>
      </main>
    </div>
  );
}
