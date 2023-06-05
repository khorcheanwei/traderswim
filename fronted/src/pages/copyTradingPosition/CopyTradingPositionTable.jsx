import React from 'react'
import { useAsyncDebounce } from 'react-table'
import { Button, PageButton } from './../shared/Button'
import { classNames } from './../shared/Utils'
import { SortIcon, SortUpIcon, SortDownIcon } from './../shared/Icons'
import { useContext, useState, useEffect } from 'react';
import { UserContext } from '../context/UserContext';
import { AccountContext } from '../context/AccountContext';
import { CopyTradingAccountContext } from '../context/CopyTradingAccountContext';
import TradingStock from '../tradingStock/TradingStock';

import axios from 'axios';
import Overlay from "./../Overlay";
import { async } from 'regenerator-runtime'
import CommonTable from '../shared/Table';

// Define a default UI for filtering
function GlobalFilter({
  preGlobalFilteredRows,
  globalFilter,
  setGlobalFilter,
}) {
  const count = preGlobalFilteredRows.length

  return (
    <div className="w-full">
      <div>
      </div>
    </div>
  )
}

function CopyTradingPositionTable({ columns, data }) {
  return CommonTable({ columns, data, GlobalFilter })
}

export default CopyTradingPositionTable;