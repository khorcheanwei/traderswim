
import { useParams } from 'react-router-dom';

import AccountsPage from './account/AccountPage.jsx';
import CopyTradingPage from './copyTrading/CopyTradingPage';
import TopCopyTradingPage from './copyTrading/TopCopyTradingPage';
import OptionPlaceOrderPanelAllPage from './copyTrading/OptionPlaceOrderPanelAllPage';
import TradeHistoryPage from './tradeHistory/TradeHistoryPage';

import {OptionPlaceOrderPanelContextProvider } from './context/OptionPlaceOrderPanelContext';

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
                <div>
                    <TopCopyTradingPage></TopCopyTradingPage>
                    <OptionPlaceOrderPanelContextProvider>
                        <CopyTradingPage>
                            <OptionPlaceOrderPanelAllPage/>
                        </CopyTradingPage>
                    </OptionPlaceOrderPanelContextProvider>
                </div>
            )}
            {subpage === 'tradehistory' && (
               <TradeHistoryPage></TradeHistoryPage>
            )}
        </div>
    )
}