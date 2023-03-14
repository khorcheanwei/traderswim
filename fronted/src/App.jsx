import axios from 'axios';
import { Route, Routes } from 'react-router';
import './App.css';
import Layout from './Layout';
import AgentLoginPage from './pages/AgentLoginPage';
import AgentRegisterPage from './pages/AgentRegisterPage';
import TradingPage from './pages/TradingPage';
import { UserContextProvider } from './UserContext';
import 'regenerator-runtime/runtime';


axios.defaults.baseURL = "http://127.0.0.1:4000";
axios.defaults.withCredentials = true;

function App() {
  return (
    <UserContextProvider>
      <Routes>
        <Route path="/" element={<Layout/>}>
          <Route path="/login" element={<AgentLoginPage />}/>
          <Route path="/register" element={<AgentRegisterPage />}/>
          <Route path="/trading/:subpage?" element={<TradingPage />}/>   
        </Route>
      </Routes>
    </UserContextProvider>
  )
}

export default App
