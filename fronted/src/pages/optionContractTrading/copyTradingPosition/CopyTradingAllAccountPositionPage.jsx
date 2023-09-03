import Overlay from "../../../pages/Overlay"
import React from 'react'
import { useContext, useState, useEffect, useRef  } from 'react';

import { CopyTradingPositionContext } from '../context/CopyTradingPositionContext';
import CopyTradingAllAccountPositionTable from './CopyTradingAllAccountPositionTable'
import {  SettledQuantityColorChange, MakeSelectedPositionPanel } from './CopyTradingPositionTable'
import TradingStockExitOrderSelected from '../tradingStock/TradingStockExitOrderSelected';
import TradingStockWarningMessage from './../tradingStock/TradingStockWarningMessage';

export default function CopyTradingAllAccountPositionPage({ rowCopyTradingPosition, onClose }) {

  const [selectedPositionDict, setSelectedPositionDict] = useState({});

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
      Header: 'Settled Qty',
      accessor: 'optionChainSettledQuantity',
      Cell: SettledQuantityColorChange,
    },
    {
      Header: 'Average price',
      accessor: 'optionChainAveragePrice',
    },
    {
      Header: 'Account Id',
      accessor: 'accountId',
    },
    {
      Header: 'Name',
      accessor: 'accountName',
    },
    {
      Header: 'Account Username',
      accessor: 'accountUsername',
    },
    {
      Header: 'SELECTED POSITION',
      accessor: 'makeSelectedPosition',
      Cell: (row) => <MakeSelectedPositionPanel row={row} setSelectedPositionDict={setSelectedPositionDict}/>,
    }
  ], [])

  const optionChainDescription = rowCopyTradingPosition.row.original.optionChainDescription;
  
  const [isOpenPositionExitSelected, setIsOpenPositionExitSelected] = useState(false);
  const [warningMessage, setWarningMessage] = useState("");
  const [isOpenWarningMessagePositionSelected, setIsOpenWarningMessagePositionSelected] = useState(false); 

  const {copyTradingPositionDataDict, setCopyTradingPositionDataDict} = useContext(CopyTradingPositionContext);

  const warningMessagePositionSelectedClose = async () => {
    setIsOpenWarningMessagePositionSelected(!isOpenWarningMessagePositionSelected);
  }

  const positionExitSelectedClose = async () => {
    if (Object.keys(selectedPositionDict).length == 0) {
      setWarningMessage("Please select at least one position!");
      warningMessagePositionSelectedClose();
    } else {
      const optionChainSettledQuantitySet = new Set();

      for (const accountUsername in selectedPositionDict) {
        const selectedPosition = selectedPositionDict[accountUsername];
        optionChainSettledQuantitySet.add(selectedPosition["optionChainSettledQuantity"]);
      }

      if (optionChainSettledQuantitySet.size > 1) {
        setWarningMessage("Quantity size of position selected are not same!");
        warningMessagePositionSelectedClose();
      } else {
        setIsOpenPositionExitSelected(!isOpenPositionExitSelected);
      }
    }
  }

  const copyTradingPositionAllAccountData = copyTradingPositionDataDict[optionChainDescription];
  var data = React.useMemo(() => copyTradingPositionAllAccountData, [copyTradingPositionAllAccountData]);

  return (
    <div>
      <div className="flex justify-between">
        <button
          type="button"
          className="inline-block rounded bg-white px-7 pt-3 pb-2.5 text-sm font-medium uppercase leading-normal text-black shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-teal-300-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-teal-300-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-teal-300-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)]"
          onClick={onClose}>
          CANCEL
        </button>
        <div className="flex space-x-2 mr-10">
          <div onClick={positionExitSelectedClose} className="cursor-pointer relative inline-flex items-center justify-center w-10 h-10 overflow-hidden rounded-full bg-red-600">
            <span className="font-medium text-white dark:text-white">S</span>
          </div>
        </div>
      </div>
      <Overlay isOpen={isOpenWarningMessagePositionSelected} >
        <TradingStockWarningMessage warningMessage={warningMessage} onClose={warningMessagePositionSelectedClose}></TradingStockWarningMessage>
      </Overlay>
      <Overlay isOpen={isOpenPositionExitSelected} >
        <TradingStockExitOrderSelected selectedPositionDict={selectedPositionDict} onClose={positionExitSelectedClose}></TradingStockExitOrderSelected>
      </Overlay>
      <CopyTradingAllAccountPositionTable columns={columns} data={data} />
    </div>
  );
}