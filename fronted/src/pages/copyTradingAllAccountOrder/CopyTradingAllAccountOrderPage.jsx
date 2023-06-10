import axios from 'axios';
import React from 'react'
import { useContext, useState, useEffect, useRef  } from 'react';

import { CopyTradingAccountContext } from '../context/CopyTradingAccountContext';
import CopyTradingAllAccountOrderTable from './CopyTradingAllAccountOrderTable'

export default function CopyTradingAllAccountOrderPage({ rowCopyTradingAccount, onClose }) {

  const columns = React.useMemo(() => [
    {
      Header: 'ID',
      accessor: 'agentTradingSessionID',
    },
    {
      Header: 'Symbol description',
      accessor: 'optionChainDescription',
    },
    {
      Header: 'Remaining Qty',
      accessor: 'optionChainRemainingQuantity',
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

  const agentTradingSessionID = rowCopyTradingAccount.row.original.agentTradingSessionID;
  
  const {copyTradingAccountDataDict, setCopyTradingAccountDataDict} = useContext(CopyTradingAccountContext);
  const copyTradingAllAccountData = copyTradingAccountDataDict[agentTradingSessionID];

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