import axios from 'axios';
import { Route, Routes } from 'react-router';
import './App.css';
import Layout from './Layout';
import AgentLoginPage from './pages/agent/AgentLoginPage';
import AgentRegisterPage from './pages/agent/AgentRegisterPage';
import TradingPage from './pages/TradingPage';
import { UserContextProvider } from './pages/context/UserContext';
import { AccountContextProvider } from './pages/context/AccountContext';
import { CopyTradingAccountContextProvider } from './pages/context/CopyTradingAccountContext';
import 'regenerator-runtime/runtime';


axios.defaults.baseURL = "http://127.0.0.1:4000";
axios.defaults.withCredentials = true;

function App() {
  return (
    <UserContextProvider>
      <AccountContextProvider>
        <CopyTradingAccountContextProvider>
          <Routes>
            <Route path="/" element={<Layout/>}>
              <Route path="/login" element={<AgentLoginPage />}/>
              <Route path="/register" element={<AgentRegisterPage />}/>
              <Route path="/trading/:subpage?" element={<TradingPage />}/>   
            </Route>
          </Routes>
          </CopyTradingAccountContextProvider>
        </AccountContextProvider> 
    </UserContextProvider>
  )
}

export default App
