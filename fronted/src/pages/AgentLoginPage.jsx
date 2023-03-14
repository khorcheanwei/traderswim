import { Link , Navigate} from 'react-router-dom';
import {useContext, useState} from 'react';
import axios from 'axios';
import { UserContext } from '../UserContext';

export default function AgentLoginPage() {
    const [agentUsername, setAgentUsername] = useState('');
    const [agentPassword,setAgentPassword] = useState('');

    const [redirect, setRedirect] = useState(false)
    const {setUser} = useContext(UserContext)

    async function handleLoginSubmit(ev) {
        ev.preventDefault()
        try {
            const {data} = await axios.post("/agent_account/login/", {agentUsername, agentPassword});
            if (typeof data.agentUsername === 'undefined') {
                alert("Login failed.");
            } else {
                setUser(data)
                alert("Login successful");
                setRedirect(true)
            }
        } catch (e) {
            alert("Login failed.");
        }    
    }

    if (redirect) {
        return <Navigate to={'/trading/accounts'} />
    }

    return (
        <div className="mt-4 grow flex items-center justify-around">
            <div className="mb-32">
                <h1 className="text-4xl text-center mb-4">Login</h1>
                <form className="max-w-md mx-auto" onSubmit={handleLoginSubmit}>
                    <input type="text" 
                        placeholder="John Doe"
                        value={agentUsername}
                        onChange={ev => setAgentUsername(ev.target.value)}/>
                    <input type="password" 
                        placeholder="************"
                        value={agentPassword}
                        onChange={ev => setAgentPassword(ev.target.value)}/>
                    <button className="primary">Login</button>
                    <div className="text-center py-2 text-gray-500">
                        Don't have an accounts yet? <Link className="underline text-black" to={'/register'}>Register now</Link>
                    </div>
                </form>
            </div>
        </div>
    );
}