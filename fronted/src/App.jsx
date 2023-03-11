import axios from 'axios';
import { Route, Routes } from 'react-router';
import './App.css';
import Layout from './Layout';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import TradingPage from './pages/TradingPage';
import { UserContextProvider } from './UserContext';


axios.defaults.baseURL = "http://127.0.0.1:4000";
axios.defaults.withCredentials = true;


function App() {
  return (
    <UserContextProvider>
      <Routes>
        <Route path="/" element={<Layout/>}>
          <Route path="/login" element={<LoginPage />}/>
          <Route path="/register" element={<RegisterPage />}/>
          <Route path="/trading/:subpage?" element={<TradingPage />}/>   
        </Route>
      </Routes>
    </UserContextProvider>
  )
}

export default App
