
import { useParams } from 'react-router-dom';

import AccountsPage from './account/AccountPage.jsx';

import TopCopyTradingPage from './optionContractTrading/copyTrading/TopCopyTradingPage';
import CopyTradingPage from './optionContractTrading/copyTrading/CopyTradingPage';
import OptionPlaceOrderPanelAllPage from './optionContractTrading/copyTrading/OptionPlaceOrderPanelAllPage';
import TradeHistoryPage from './optionContractTrading/tradeHistory/TradeHistoryPage';
import { OptionPlaceOrderPanelContextProvider } from './optionContractTrading/context/OptionPlaceOrderPanelContext'
import { OptionContractPlaceOrderContextProvider } from './optionContractTrading/context/OptionContractPlaceOrderContext';
import { CopyTradingOrderContextProvider } from './optionContractTrading/context/CopyTradingOrderContext';
import { CopyTradingPositionContextProvider } from './optionContractTrading/context/CopyTradingPositionContext';
import { TradeHistoryContextProvider } from './optionContractTrading/context/TradeHistoryContext';
import { TradeStockContextProvider } from './optionContractTrading/context/TradeStockContext';


import StockTopCopyTradingPage from './stockTrading/copyTrading/StockTopCopyTradingPage';
import StockCopyTradingPage from './stockTrading/copyTrading/StockCopyTradingPage';
import StockPlaceOrderPanelAllPage from './stockTrading/copyTrading/StockPlaceOrderPanelAllPage.jsx';
import StockTradeHistoryPage from './stockTrading/tradeHistory/StockTradeHistoryPage';
import { StockPlaceOrderPanelContextProvider } from './stockTrading/context/StockPlaceOrderPanelContext';
import { StockPlaceOrderContextProvider } from './stockTrading/context/StockPlaceOrderContext';
import { StockCopyTradingOrderContextProvider } from './stockTrading/context/StockCopyTradingOrderContext'
import { StockCopyTradingPositionContextProvider } from './stockTrading/context/StockCopyTradingPositionContext';
import { StockTradeHistoryContextProvider } from './stockTrading/context/StockTradeHistoryContext';
import { StockTradeContextProvider } from './stockTrading/context/StockTradeContext';



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
            {subpage === 'optionCopyTrading' && (
                <CopyTradingOrderContextProvider>
                    <CopyTradingPositionContextProvider>
                            <TradeStockContextProvider>
                                <OptionPlaceOrderPanelContextProvider>
                                    <OptionContractPlaceOrderContextProvider>
                                        <TopCopyTradingPage></TopCopyTradingPage>
                                    </OptionContractPlaceOrderContextProvider>
                                    <CopyTradingPage>
                                        <OptionPlaceOrderPanelAllPage></OptionPlaceOrderPanelAllPage>
                                    </CopyTradingPage>
                                </OptionPlaceOrderPanelContextProvider>
                            </TradeStockContextProvider>
                    </CopyTradingPositionContextProvider>
                </CopyTradingOrderContextProvider>
            )}
            {subpage === 'stockCopyTrading' && (
                <StockCopyTradingOrderContextProvider>
                    <StockCopyTradingPositionContextProvider>
                        <StockTradeHistoryContextProvider>
                            <StockTradeContextProvider>
                                <StockPlaceOrderPanelContextProvider>
                                    <StockPlaceOrderContextProvider>
                                        <StockTopCopyTradingPage></StockTopCopyTradingPage>
                                    </StockPlaceOrderContextProvider>
                                    <StockCopyTradingPage>
                                        <StockPlaceOrderPanelAllPage></StockPlaceOrderPanelAllPage>
                                    </StockCopyTradingPage>
                                </StockPlaceOrderPanelContextProvider>
                            </StockTradeContextProvider>
                        </StockTradeHistoryContextProvider>
                    </StockCopyTradingPositionContextProvider>
                </StockCopyTradingOrderContextProvider>
            )}
            {subpage === 'optionTradeHistory' && (
                <TradeHistoryContextProvider>
                    <TradeHistoryPage></TradeHistoryPage>
                </TradeHistoryContextProvider>
            )}
            {subpage === 'stockTradeHistory' && (
                <StockTradeHistoryContextProvider>
                    <StockTradeHistoryPage></StockTradeHistoryPage>
                </StockTradeHistoryContextProvider>
            )}
        </div>
    )
}