import axios from 'axios';
import React from 'react'
import { useContext, useState, useEffect, useRef  } from 'react';

import CopyTradingOrderPage from '../copyTradingAllAccountOrder/CopyTradingOrderPage.jsx'
import CopyTradingPositionPage from '../copyTradingPosition/CopyTradingPositionPage'

export default function CopyTradingPage() {
  return (
    <div>
      <CopyTradingOrderPage />
      <CopyTradingPositionPage/>
      
    </div>
  );
}