import axios from "axios";
import { useState, memo } from "react";
import StockHandleOrder, {
  get_duration_and_session,
  get_duration_and_session_reverse,
} from "./StockHandleOrder";

const StockReplaceOrderSelected = memo(
  ({ rowCopyTradingOrderSelected, selectedOrderDict, onClose }) => {
    const [isLoading, setIsLoading] = useState(false);

    var stockInstructionList = ["BUY", "SELL"];
    var stockOrderTypeList = [
      "MARKET",
      "LIMIT",
      "STOP",
      "STOP_LIMIT",
      "TRAILING_STOP",
    ];
    var stockSessionDurationList = ["DAY", "GTC", "EXT", "GTC_EXT"];

    var stockStopPriceLinkTypeDict = {
      "$ Dollars": "VALUE",
      "% Percent": "PERCENT",
    };
    var stockStopPriceLinkTypeReverseDict = {
      VALUE: "$ Dollars",
      PERCENT: "% Percent",
    };

    let agentTradingSessionID =
      rowCopyTradingOrderSelected.cell.row.original.agentTradingSessionID;

    let accountId = rowCopyTradingOrderSelected.cell.row.original.accountId;
    let accountName = rowCopyTradingOrderSelected.cell.row.original.accountName;
    let accountUsername =
      rowCopyTradingOrderSelected.cell.row.original.accountUsername;

    let stockOrderId =
      rowCopyTradingOrderSelected.cell.row.original.stockOrderId;
    let rowStockSymbol =
      rowCopyTradingOrderSelected.cell.row.original.stockSymbol;
    let rowStockSession =
      rowCopyTradingOrderSelected.cell.row.original.stockSession;
    let rowStockDuration =
      rowCopyTradingOrderSelected.cell.row.original.stockDuration;
    let rowStockOrderType =
      rowCopyTradingOrderSelected.cell.row.original.stockOrderType;
    let rowStockInstruction =
      rowCopyTradingOrderSelected.cell.row.original.stockInstruction;
    let rowStockPrice =
      rowCopyTradingOrderSelected.cell.row.original.stockPrice ?? 0;
    let rowStockStopPrice =
      rowCopyTradingOrderSelected.cell.row.original.stockStopPrice ?? 0;
    let rowStockStopPriceLinkType =
      rowCopyTradingOrderSelected.cell.row.original.stockStopPriceLinkType ??
      "VALUE";
    let rowStockStopPriceOffset =
      rowCopyTradingOrderSelected.cell.row.original.stockStopPriceOffset ?? 0.1;
    let rowStockQuantity =
      rowCopyTradingOrderSelected.cell.row.original.stockQuantity;

    const [stockSymbol, setStockSymbol] = useState(rowStockSymbol);
    const [stockInstruction, setStockInstruction] =
      useState(rowStockInstruction);
    const [stockSessionDuration, setStockSessionDuration] = useState(
      get_duration_and_session_reverse(rowStockSession, rowStockDuration)
    );
    const [stockOrderType, setStockOrderType] = useState(rowStockOrderType);
    const [stockQuantity, setStockQuantity] = useState(rowStockQuantity);

    const [stockPrice, setStockPrice] = useState(rowStockPrice);
    const [stockStopPrice, setStockStopPrice] = useState(rowStockStopPrice);
    const [stockStopPriceLinkTypeSymbol, setStockStopPriceLinkTypeSymbol] =
      useState(stockStopPriceLinkTypeReverseDict[rowStockStopPriceLinkType]);
    const [stockStopPriceOffset, setStockStopPriceOffset] = useState(
      rowStockStopPriceOffset
    );

    const [disabledButton, setDisabledButton] = useState(false);

    async function handleReplaceOrderSelected() {
      // replace order for selected order
      setDisabledButton(true);
      try {
        const allTradingAccountsOrderList = [];

        for (const [key, value] of Object.entries(selectedOrderDict)) {
          // Add the key-value pair as an item to the list
          allTradingAccountsOrderList.push({
            accountId: value["accountId"],
            accountName: value["accountName"],
            accountUsername: value["accountUsername"],
            stockOrderId: value["stockOrderId"],
          });
        }

        const { stockSession, stockDuration } =
          get_duration_and_session(stockSessionDuration);
        const stockStopPriceLinkType =
          stockStopPriceLinkTypeDict[stockStopPriceLinkTypeSymbol];
        const { data } = await axios.put("/stock_copy_trading/replace_order/", {
          agentTradingSessionID,
          allTradingAccountsOrderList,
          stockSymbol,
          stockSession,
          stockDuration,
          stockInstruction,
          stockOrderType,
          stockQuantity,
          stockPrice,
          stockStopPrice,
          stockStopPriceLinkType,
          stockStopPriceOffset,
        });

        if (data == "success") {
          alert("Replace selected order successful");
          onClose();
        } else {
          alert("Replace selected order failed");
        }
      } catch (error) {
        alert("Replace selected order failed");
        console.log(error.message);
      }
      setDisabledButton(false);
    }

    return (
      <div>
        <div className="mb-4">
          <h1 className="block text-gray-700 text-lm font-bold mb-2">
            Stock Replace Order (Selected)
          </h1>
        </div>
        <StockHandleOrder
          setIsLoading={setIsLoading}
          isOpenStock={false}
          isExitStock={false}
          stockSymbol={stockSymbol}
          setStockSymbol={setStockSymbol}
          stockInstruction={stockInstruction}
          setStockInstruction={setStockInstruction}
          stockSessionDuration={stockSessionDuration}
          setStockSessionDuration={setStockSessionDuration}
          stockOrderType={stockOrderType}
          setStockOrderType={setStockOrderType}
          stockQuantity={stockQuantity}
          setStockQuantity={setStockQuantity}
          stockPrice={stockPrice}
          setStockPrice={setStockPrice}
          stockStopPrice={stockStopPrice}
          setStockStopPrice={setStockStopPrice}
          stockStopPriceLinkTypeSymbol={stockStopPriceLinkTypeSymbol}
          setStockStopPriceLinkTypeSymbol={setStockStopPriceLinkTypeSymbol}
          stockStopPriceOffset={stockStopPriceOffset}
          setStockStopPriceOffset={setStockStopPriceOffset}
        ></StockHandleOrder>
        <div className="flex justify-end gap-5">
          <button
            type="button"
            className="inline-block rounded bg-white px-7 pt-3 pb-2.5 text-sm font-medium uppercase leading-normal text-black shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-teal-300-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-teal-300-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-teal-300-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)]"
            onClick={onClose}
          >
            CANCEL
          </button>
          <button
            type="button"
            className="inline-block rounded bg-teal-300 px-7 pt-3 pb-2.5 text-sm font-medium uppercase leading-normal text-white shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-teal-300-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-teal-300-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-teal-300-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)]"
            onClick={handleReplaceOrderSelected}
            disabled={disabledButton}
          >
            Replace order
          </button>
        </div>
      </div>
    );
  }
);

export default StockReplaceOrderSelected;
