
import { useParams } from 'react-router-dom';

import AccountsPage from './account/AccountPage.jsx';
import TopCopyTradingPage from './copyTrading/TopCopyTradingPage';
import CopyTradingPage from './copyTrading/CopyTradingPage';
import OptionPlaceOrderPanelAllPage from './copyTrading/OptionPlaceOrderPanelAllPage';
import TradeHistoryPage from './tradeHistory/TradeHistoryPage';

import {OptionPlaceOrderPanelContextProvider } from './context/OptionPlaceOrderPanelContext';
import { OptionContractPlaceOrderContextProvider } from './context/OptionContractPlaceOrderContext';

export default function Trading() {

    let {subpage} = useParams();

    if (subpage === undefined) {
        subpage = "account"
    }

    return (
        <div>
            {subpage === 'account' && (
                <AccountsPage></AccountsPage>
            )}
            {subpage === 'copytrading' && (
                <OptionPlaceOrderPanelContextProvider>
                    <OptionContractPlaceOrderContextProvider>
                        <TopCopyTradingPage></TopCopyTradingPage>
                    </OptionContractPlaceOrderContextProvider>
                    <CopyTradingPage>
                        <OptionPlaceOrderPanelAllPage></OptionPlaceOrderPanelAllPage>
                    </CopyTradingPage>
                </OptionPlaceOrderPanelContextProvider>
            )}
            {subpage === 'tradehistory' && (
               <TradeHistoryPage></TradeHistoryPage>
            )}
        </div>
    )
}