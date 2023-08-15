
import { useParams } from 'react-router-dom';

import AccountsPage from './account/AccountPage.jsx';
import TopCopyTradingPage from './optionContractTrading/copyTrading/TopCopyTradingPage';
import CopyTradingPage from './optionContractTrading/copyTrading/CopyTradingPage';
import OptionPlaceOrderPanelAllPage from './optionContractTrading/copyTrading/OptionPlaceOrderPanelAllPage';
import TradeHistoryPage from './optionContractTrading/tradeHistory/TradeHistoryPage';

import { OptionPlaceOrderPanelContextProvider } from './optionContractTrading/context/OptionPlaceOrderPanelContext';
import { OptionContractPlaceOrderContextProvider } from './optionContractTrading/context/OptionContractPlaceOrderContext';

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