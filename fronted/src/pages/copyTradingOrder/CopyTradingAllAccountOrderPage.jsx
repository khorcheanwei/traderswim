import axios from 'axios';
import React from 'react'
import { useContext, useState, useEffect, useRef  } from 'react';

import { CopyTradingOrderContext } from '../context/CopyTradingOrderContext';
import CopyTradingAllAccountOrderTable from './CopyTradingAllAccountOrderTable'
import { ChangeOrderIndividualPanel} from './CopyTradingAllAccountOrderTable'

export default function CopyTradingAllAccountOrderPage({ rowCopyTradingOrder, onClose }) {

  const columns = React.useMemo(() => [
    {
      Header: 'ID',
      accessor: 'agentTradingSessionID',
    },
    {
      Header: 'Account Id',
      accessor: 'accountId',
    },
    {
      Header: 'Symbol',
      accessor: 'optionChainSymbol',
    },
    {
      Header: 'Change order',
      accessor: 'ChangeOrder',
      Cell: ChangeOrderIndividualPanel,
    },
    {
      Header: 'Symbol description',
      accessor: 'optionChainDescription',
    },
    {
      Header: 'Option chain order Id',
      accessor: 'optionChainOrderId',
    },
    {
      Header: 'Filled Qty',
      accessor: 'optionChainFilledQuantity',
    },
    {
      Header: 'Price',
      accessor: 'optionChainPrice',
    },
    {
      Header: 'Qty',
      accessor: 'optionChainQuantity',
    },
    {
      Header: 'Side Pos Effect',
      accessor: 'optionChainInstruction',
    },
    {
      Header: 'Status',
      accessor: 'optionChainStatus',
    },
    {
      Header: 'Order type',
      accessor: 'optionChainOrderType',
    },
    {
      Header: 'Time',
      accessor: 'optionChainEnteredTime',
    },
    {
      Header: 'Name',
      accessor: 'accountName',
    },
    {
      Header: 'Account Username',
      accessor: 'accountUsername',
    },
  ], [])

  const agentTradingSessionID = rowCopyTradingOrder.row.original.agentTradingSessionID;
  
  const {copyTradingOrderDataDict, setCopyTradingOrderDataDict} = useContext(CopyTradingOrderContext);
  const copyTradingAllAccountData = copyTradingOrderDataDict[agentTradingSessionID];

  var data = React.useMemo(() => copyTradingAllAccountData, [copyTradingAllAccountData])

  return (
    <div>
        <button
            type="button"
            className="inline-block rounded bg-white px-7 pt-3 pb-2.5 text-sm font-medium uppercase leading-normal text-black shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-teal-300-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-teal-300-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-teal-300-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)]"
            onClick={onClose}>
            CANCEL
        </button>
        <CopyTradingAllAccountOrderTable columns={columns} data={data} />
    </div>
  );
}