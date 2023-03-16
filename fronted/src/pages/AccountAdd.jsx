import axios from "axios";
import { Link , Navigate} from 'react-router-dom';
import {useContext, useState, useEffect } from 'react';
import { UserContext } from '../UserContext';

export default function AccountAdd() {
    const [accountName, setAccountName] = useState("");
    const [accountUsername, setAccountUsername] = useState("");
    const [accountPassword, setAccountPassword] = useState("");

    const [agentID, setAgentID] = useState(null);
    const { contextAgentID, setIsOpenAccountLogin} = useContext(UserContext);

    useEffect(() => {
        if (!agentID) {
            axios.get("/agent_account/profile").then(({data}) =>{
                setAgentID(data.agentID)
            })  
        }
    }, [])

    async function handleAccountAdd(ev) {
        ev.preventDefault()
        try {
            const agentID = contextAgentID
            const {data} = await axios.post("/trading_account/login/", {agentID, accountName, accountUsername, accountPassword});

            if (typeof data.accountName === 'undefined') {
                alert("Account add failed.");
            } else {
                alert("Account add successful");
                setIsOpenAccountLogin(close)
            }
        } catch (e) {
            console.log(e)
            alert("Login failed.");
        }   
    }

    return (
       
        <form>
            <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Account Name</label>
                <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
                    type="text" 
                    value={accountName}
                    onChange={ev => setAccountName(ev.target.value)}
                    placeholder="AccountName">    
                </input>
            </div>
            <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Username</label>
                <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
                    type="text" 
                    value={accountUsername}
                    onChange={ev => setAccountUsername(ev.target.value)}
                    placeholder="Username">
                </input>
            </div>
            <div className="mb-6">  
                <label className="block text-gray-700 text-sm font-bold mb-2" >Password</label>
                <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline" 
                    type="accountPassword" 
                    value={accountPassword}
                    onChange={ev => setAccountPassword(ev.target.value)}
                    placeholder="******************">
                </input>
            </div>
            <div className="flex items-center justify-between">
            <div className="text-center lg:text-left">
            <button
              type="button"
              onClick={handleAccountAdd}
              className="inline-block rounded bg-teal-300 px-7 pt-3 pb-2.5 text-sm font-medium uppercase leading-normal text-white shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-teal-300-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-teal-300-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-teal-300-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)]"
              >
              Login
            </button>
          </div>
            </div>
        </form>
    )
}