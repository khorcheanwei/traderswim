import React from "react";
import { useContext } from "react";

import { CopyTradingOrderContext } from "../context/CopyTradingOrderContext";
import CopyTradingOrderTable, {
  ChangeOrderPanel,
  ViewAllOrderPanel,
  OptionChainStatusColorPanel,
} from "./CopyTradingOrderTable";

export default function CopyTradingOrderPage() {
  const { copyTradingOrderMainData, setCopyTradingOrderMainData } = useContext(
    CopyTradingOrderContext,
  );

  const columns = React.useMemo(
    () => [
      {
        Header: "ID",
        accessor: "agentTradingSessionID",
      },
      {
        Header: "Account Id",
        accessor: "accountId",
      },
      {
        Header: "View",
        accessor: "viewAllOrder",
        Cell: ViewAllOrderPanel,
      },
      {
        Header: "Change order",
        accessor: "ChangeOrder",
        Cell: ChangeOrderPanel,
      },
      {
        Header: "Symbol",
        accessor: "optionChainSymbol",
      },
      {
        Header: "Symbol description",
        accessor: "optionChainDescription",
      },
      {
        Header: "Option chain order Id",
        accessor: "optionChainOrderId",
      },
      {
        Header: "Filled Qty",
        accessor: "optionChainFilledQuantity",
      },
      {
        Header: "Price",
        accessor: "optionChainPrice",
      },
      {
        Header: "Qty",
        accessor: "optionChainQuantity",
      },
      {
        Header: "Side Pos Effect",
        accessor: "optionChainInstruction",
      },
      {
        Header: "Status",
        accessor: "optionChainStatus",
      },
      {
        Header: "Order type",
        accessor: "optionChainOrderType",
      },
      {
        Header: "Time",
        accessor: "optionChainEnteredTime",
      },
      {
        Header: "Status",
        accessor: "optionChainStatusColor",
        Cell: OptionChainStatusColorPanel,
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

  var data = React.useMemo(
    () => copyTradingOrderMainData,
    [copyTradingOrderMainData],
  );

  return <CopyTradingOrderTable columns={columns} data={data} />;
}
