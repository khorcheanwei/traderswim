import axios from "axios";
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';

import { UserContext } from './../context/UserContext';

export default function LogoutConfirmation({ onClose }) {
    const navigate = useNavigate();

    const { contextAgentUsername, setContextAgentUsername, isLogoutConfirmation, setIsLogoutConfirmation } = useContext(UserContext);

    async function logOut() {
        try {
            await axios.post("http://localhost:4000/agent_account/logout");
            setContextAgentUsername(null);
            navigate('/login')
            setIsLogoutConfirmation(!isLogoutConfirmation);
            alert("Log out successfully");
        } catch (error) {
            console.log(error.message);
            alert("Log out failed.");
        }
    }

    return (
        <form>
            <div className="mb-4">
                <h1 className="block text-gray-700 text-lm mb-2">Are you sure you want to log out?</h1>
            </div>
            <div className="flex justify-end gap-5">
                <button
                    type="button"
                    className="inline-block rounded bg-white px-7 pt-3 pb-2.5 text-sm font-medium uppercase leading-normal text-black shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-teal-300-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-teal-300-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-teal-300-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)]"
                    onClick={onClose}
                >
                    CANCEL
                </button>
                <button
                    type="button"
                    className="inline-block rounded bg-teal-300 px-7 pt-3 pb-2.5 text-sm font-medium uppercase leading-normal text-white shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-teal-300-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-teal-300-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-teal-300-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)]"
                    onClick={logOut}
                >
                    Log Out
                </button>
            </div>
        </form>
    )
}