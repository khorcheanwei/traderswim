import axios from 'axios';
import { Route, Routes } from 'react-router';
import './App.css';
import Layout from './Layout';
import AgentLoginPage from './pages/agent/AgentLoginPage';
import AgentRegisterPage from './pages/agent/AgentRegisterPage';
import TradingPage from './pages/TradingPage';
import { UserContextProvider } from './pages/context/UserContext';
import { AccountContextProvider } from './pages/context/AccountContext';
import { CopyTradingOrderContextProvider } from './pages/optionContractTrading/context/CopyTradingOrderContext';
import { CopyTradingPositionContextProvider } from './pages/optionContractTrading/context/CopyTradingPositionContext';
import { TradeHistoryContextProvider } from './pages/optionContractTrading/context/TradeHistoryContext';
import { TradeStockContextProvider } from './pages/optionContractTrading/context/TradeStockContext';
 
axios.defaults.baseURL = "http://localhost:4000";
axios.defaults.withCredentials = true;

function App() {

  return (
    <UserContextProvider>
      <AccountContextProvider>
        <CopyTradingOrderContextProvider>
          <CopyTradingPositionContextProvider>
            <TradeHistoryContextProvider>
              <TradeStockContextProvider>
                <Routes>
                  <Route path="/" element={<Layout />}>
                    <Route path="/login" element={<AgentLoginPage />} />
                    <Route path="/register" element={<AgentRegisterPage />} />
                    <Route path="/trading/:subpage?" element={<TradingPage />} />
                  </Route>
                </Routes>
              </TradeStockContextProvider>
            </TradeHistoryContextProvider>
          </CopyTradingPositionContextProvider>
          </CopyTradingOrderContextProvider>
      </AccountContextProvider>
    </UserContextProvider>
  )
}

export default App
