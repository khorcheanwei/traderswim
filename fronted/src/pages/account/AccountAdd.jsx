import axios from "axios";
import { useContext, useState } from 'react';
import { AccountContext } from '../context/AccountContext';

export default function AccountAdd({ onClose }) {
    const [accountName, setAccountName] = useState("");
    const [accountUsername, setAccountUsername] = useState("");
    const [accountPassword, setAccountPassword] = useState("");

    const { isOpenAccountLogin, setIsOpenAccountLogin, setIsAccountLoginSuccessful } = useContext(AccountContext);

    const [disabledButton, setDisabledButton] = useState(false)

    async function handleAccountAdd(event) {
        event.preventDefault()
        try {
            setDisabledButton(true)
            const { data } = await axios.post("/trading_account/login/", { accountName, accountUsername, accountPassword });
            
            if (typeof data.accountName === "undefined") {
                alert("Account added failed. " + data);
            } else {
                alert("Account added successful");
                setIsOpenAccountLogin(!isOpenAccountLogin)
                setIsAccountLoginSuccessful(true)
            }
            setDisabledButton(false)
        } catch (error) {
            console.log(error.message);
            alert("Login failed.");
        }
    }

    return (

        <form>
            <div className="mb-4">
                <h1 className="block text-gray-700 text-lm font-bold mb-2">Add new Trading Account</h1>
            </div>
            <div className="mb-4">
                <label className="block text-gray-700 text-sm mb-2">Name</label>
                <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    type="text"
                    value={accountName}
                    onChange={event => setAccountName(event.target.value)}
                    placeholder="account1">
                </input>
            </div>
            <div className="mb-4">
                <label className="block text-gray-700 text-sm mb-2">Account Username</label>
                <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    type="text"
                    value={accountUsername}
                    onChange={event => setAccountUsername(event.target.value)}
                    placeholder="paul">
                </input>
            </div>
            <div className="mb-6">
                <label className="block text-gray-700 text-sm mb-2" >Account Password</label>
                <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                    type="password"
                    value={accountPassword}
                    onChange={event => setAccountPassword(event.target.value)}
                    placeholder="******">
                </input>
            </div>
            <div className="flex items-center justify-between">
                <div className="text-center lg:text-left">
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
                            disabled={disabledButton}
                            className="inline-block rounded bg-teal-300 px-7 pt-3 pb-2.5 text-sm font-medium uppercase leading-normal text-white shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-teal-300-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-teal-300-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-teal-300-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)]"
                            onClick={handleAccountAdd}
                        >
                            Login
                        </button>
                    </div>
                </div>
            </div>
        </form>
    )
}