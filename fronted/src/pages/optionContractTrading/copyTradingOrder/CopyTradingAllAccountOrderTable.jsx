import React from "react";
import { useAsyncDebounce } from "react-table";
import { useContext } from "react";

import TradingStockDeleteOrderIndividual from "./../tradingStock/TradingStockDeleteOrderIndividual";
import TradingStockReplaceOrderIndividual from "./../tradingStock/TradingStockReplaceOrderIndividual";

import { CopyTradingOrderContext } from "../context/CopyTradingOrderContext";

import CommonTable from "./../../shared/Table";
import Overlay from "./../../Overlay";

// Define a default UI for filtering
function GlobalFilter({
  preGlobalFilteredRows,
  globalFilter,
  setGlobalFilter,
}) {
  return <div></div>;
}

function getOptionChainStatusColor(optionChainStatus) {
  let optionChainOwnStatusColor = true;
  let optionChainStatusInactiveList = [
    "REJECTED",
    "CANCELED",
    "FILLED",
    "EXPIRED",
  ];
  if (!optionChainStatusInactiveList.includes(optionChainStatus)) {
    optionChainOwnStatusColor = false;
  }
  return optionChainOwnStatusColor;
}

export function TextOptionChainDescriptionColorPanel(row) {
  let optionChainStatus = row.cell.row.original.optionChainStatus;
  let optionChainOwnStatusColor = getOptionChainStatusColor(optionChainStatus);
  let optionChainDescription = row.cell.row.original.optionChainDescription;
  return (
    <div>
      {optionChainOwnStatusColor ? (
        <div>{optionChainDescription}</div>
      ) : (
        <div className="text-yellow-700">{optionChainDescription}</div>
      )}
    </div>
  );
}

export function TextOptionChainFilledQuantityColorPanel(row) {
  let optionChainStatus = row.cell.row.original.optionChainStatus;
  let optionChainOwnStatusColor = getOptionChainStatusColor(optionChainStatus);
  let optionChainFilledQuantity =
    row.cell.row.original.optionChainFilledQuantity;
  return (
    <div>
      {optionChainOwnStatusColor ? (
        <div>{optionChainFilledQuantity}</div>
      ) : (
        <div className="text-yellow-700">{optionChainFilledQuantity}</div>
      )}
    </div>
  );
}

export function TextOptionChainPriceColorPanel(row) {
  let optionChainStatus = row.cell.row.original.optionChainStatus;
  let optionChainOwnStatusColor = getOptionChainStatusColor(optionChainStatus);
  let optionChainPrice = row.cell.row.original.optionChainPrice;
  return (
    <div>
      {optionChainOwnStatusColor ? (
        <div>{optionChainPrice}</div>
      ) : (
        <div className="text-yellow-700">{optionChainPrice}</div>
      )}
    </div>
  );
}

export function TextOptionChainQuantityColorPanel(row) {
  let optionChainStatus = row.cell.row.original.optionChainStatus;
  let optionChainOwnStatusColor = getOptionChainStatusColor(optionChainStatus);
  let optionChainQuantity = row.cell.row.original.optionChainQuantity;
  return (
    <div>
      {optionChainOwnStatusColor ? (
        <div>{optionChainQuantity}</div>
      ) : (
        <div className="text-yellow-700">{optionChainQuantity}</div>
      )}
    </div>
  );
}

export function TextOptionChainInstructionColorPanel(row) {
  let optionChainStatus = row.cell.row.original.optionChainStatus;
  let optionChainOwnStatusColor = getOptionChainStatusColor(optionChainStatus);
  let optionChainInstruction = row.cell.row.original.optionChainInstruction;
  return (
    <div>
      {optionChainOwnStatusColor ? (
        <div>{optionChainInstruction}</div>
      ) : (
        <div className="text-yellow-700">{optionChainInstruction}</div>
      )}
    </div>
  );
}

export function TextOptionChainStatusColorPanel(row) {
  let optionChainStatus = row.cell.row.original.optionChainStatus;
  let optionChainOwnStatusColor = getOptionChainStatusColor(optionChainStatus);
  return (
    <div>
      {optionChainOwnStatusColor ? (
        <div>{optionChainStatus}</div>
      ) : (
        <div className="text-yellow-700">{optionChainStatus}</div>
      )}
    </div>
  );
}

export function TextOptionChainOrderTypeColorPanel(row) {
  let optionChainStatus = row.cell.row.original.optionChainStatus;
  let optionChainOwnStatusColor = getOptionChainStatusColor(optionChainStatus);
  let optionChainOrderType = row.cell.row.original.optionChainOrderType;
  return (
    <div>
      {optionChainOwnStatusColor ? (
        <div>{optionChainOrderType}</div>
      ) : (
        <div className="text-yellow-700">{optionChainOrderType}</div>
      )}
    </div>
  );
}

export function TextOptionChainEnteredTimeColorPanel(row) {
  let optionChainStatus = row.cell.row.original.optionChainStatus;
  let optionChainOwnStatusColor = getOptionChainStatusColor(optionChainStatus);
  let optionChainEnteredTime = row.cell.row.original.optionChainEnteredTime;
  return (
    <div>
      {optionChainOwnStatusColor ? (
        <div>{optionChainEnteredTime}</div>
      ) : (
        <div className="text-yellow-700">{optionChainEnteredTime}</div>
      )}
    </div>
  );
}

export function TextAccountNameColorPanel(row) {
  let optionChainStatus = row.cell.row.original.optionChainStatus;
  let optionChainOwnStatusColor = getOptionChainStatusColor(optionChainStatus);
  let accountName = row.cell.row.original.accountName;
  return (
    <div>
      {optionChainOwnStatusColor ? (
        <div>{accountName}</div>
      ) : (
        <div className="text-yellow-700">{accountName}</div>
      )}
    </div>
  );
}

export function TextAccountUsernameColorPanel(row) {
  let optionChainStatus = row.cell.row.original.optionChainStatus;
  let optionChainOwnStatusColor = getOptionChainStatusColor(optionChainStatus);
  let accountUsername = row.cell.row.original.accountUsername;
  return (
    <div>
      {optionChainOwnStatusColor ? (
        <div>{accountUsername}</div>
      ) : (
        <div className="text-yellow-700">{accountUsername}</div>
      )}
    </div>
  );
}

export function MakeSelectedOrderPanel({ row, setSelectedOrderDict }) {
  const handleSelectedOrderChange = (event) => {
    setSelectedOrderDict((prevSelectedOrderDict) => {
      const newSelectedOrderDict = { ...prevSelectedOrderDict };
      const accountUsername = row.cell.row.original.accountUsername;

      const newSelectedOrder = {
        accountId: row.cell.row.original.accountId,
        accountName: row.cell.row.original.accountName,
        accountUsername: row.cell.row.original.accountUsername,
        optionChainOrderId: row.cell.row.original.optionChainOrderId,
      };

      if (
        newSelectedOrderDict.hasOwnProperty(
          row.cell.row.original.accountUsername,
        ) &&
        !event.target.checked
      ) {
        delete newSelectedOrderDict[accountUsername];
      } else {
        newSelectedOrderDict[accountUsername] = newSelectedOrder;
      }
      return newSelectedOrderDict;
    });
  };
  return (
    <div className="">
      <input
        id="selected-order-checkbox"
        type="checkbox"
        value=""
        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
        onChange={handleSelectedOrderChange}
      />
    </div>
  );
}

export function ChangeOrderIndividualPanel(row) {
  const {
    isOpenOrderReplaceIndividual,
    setIsOpenOrderReplaceIndividual,
    isOpenOrderDeleteIndividual,
    setIsOpenOrderDeleteIndividual,
  } = useContext(CopyTradingOrderContext);

  const { rowCopyTradingOrderIndividual, setRowCopyTradingOrderIndividual } =
    useContext(CopyTradingOrderContext);

  const orderReplaceCloseIndividual = async () => {
    if (isOpenOrderReplaceIndividual == false) {
      setRowCopyTradingOrderIndividual(row);
    }
    setIsOpenOrderReplaceIndividual(!isOpenOrderReplaceIndividual);
  };

  const orderDeleteCloseIndividual = async () => {
    if (isOpenOrderDeleteIndividual == false) {
      setRowCopyTradingOrderIndividual(row);
    }
    setIsOpenOrderDeleteIndividual(!isOpenOrderDeleteIndividual);
  };

  return (
    <div className="flex">
      <div className="flex space-x-2">
        <div
          onClick={orderReplaceCloseIndividual}
          className="cursor-pointer relative inline-flex items-center justify-center w-10 h-10 overflow-hidden rounded-full bg-yellow-300"
        >
          <span className="font-medium text-white dark:text-white">R</span>
        </div>
        <div
          onClick={orderDeleteCloseIndividual}
          className="cursor-pointer relative inline-flex items-center justify-center w-10 h-10 overflow-hidden rounded-full bg-middleGreen"
        >
          <span className="font-medium text-white dark:text-white">C</span>
        </div>
      </div>
      <Overlay isOpen={isOpenOrderReplaceIndividual}>
        <TradingStockReplaceOrderIndividual
          rowCopyTradingOrderIndividual={rowCopyTradingOrderIndividual}
          onClose={orderReplaceCloseIndividual}
        ></TradingStockReplaceOrderIndividual>
      </Overlay>
      <Overlay isOpen={isOpenOrderDeleteIndividual}>
        <TradingStockDeleteOrderIndividual
          rowCopyTradingOrderIndividual={rowCopyTradingOrderIndividual}
          onClose={orderDeleteCloseIndividual}
        ></TradingStockDeleteOrderIndividual>
      </Overlay>
    </div>
  );
}

function CopyTradingAllAccountOrderTable({ columns, data }) {
  let hiddenColumns = [
    "accountId",
    "optionChainSymbol",
    "optionChainOrderId",
    "agentTradingSessionID",
    "optionChainOwnStatusColor",
  ];
  return CommonTable({ columns, data, GlobalFilter, hiddenColumns });
}

export default CopyTradingAllAccountOrderTable;
