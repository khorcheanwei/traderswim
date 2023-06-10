import axios from 'axios';
import React from 'react'
import { useContext, useState, useEffect, useRef  } from 'react';

import { CopyTradingPositionContext } from '../context/CopyTradingPositionContext';
import CopyTradingAllAccountPositionTable from './CopyTradingAllAccountPositionTable'

export default function CopyTradingAllAccountPositionPage({ rowCopyTradingPosition, onClose }) {

  const columns = React.useMemo(() => [
    {
      Header: 'Symbol',
      accessor: 'optionChainSymbol',
    },
    {
      Header: 'Symbol description',
      accessor: 'optionChainDescription',
    },
    {
      Header: 'Average price',
      accessor: 'optionChainAveragePrice',
    },
    {
      Header: 'Long Qty',
      accessor: 'optionChainLongQuantity',
    },
    {
      Header: 'Settled Long Qty',
      accessor: 'optionChainSettledLongQuantity',
    },
    {
      Header: 'Short Qty',
      accessor: 'optionChainShortQuantity',
    },
    {
      Header: 'Settled Short Qty',
      accessor: 'optionChainSettledShortQuantity',
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

  const optionChainDescription = rowCopyTradingPosition.row.original.optionChainDescription;
  
  const {copyTradingPositionAccountDataDict, setCopyTradingPositionAccountDataDict} = useContext(CopyTradingPositionContext);
  const copyTradingPositionAllAccountData = copyTradingPositionAccountDataDict[optionChainDescription];

  var data = React.useMemo(() => copyTradingPositionAllAccountData, [copyTradingPositionAllAccountData])

  return (
    <div>
        <button
            type="button"
            className="inline-block rounded bg-white px-7 pt-3 pb-2.5 text-sm font-medium uppercase leading-normal text-black shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-teal-300-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-teal-300-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-teal-300-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)]"
            onClick={onClose}>
            CANCEL
        </button>
        <CopyTradingAllAccountPositionTable columns={columns} data={data} />
    </div>
  );
}