import { Link } from 'react-router-dom';
import {useState} from 'react';
import axios from "axios";


export default function AgentRegisterPage() {
    const [agentUsername, setAgentUsername] = useState('');
    const [agentEmail,setAgentEmail] = useState('');
    const [agentPassword,setAgentPassword] = useState('');

    async function registerUser(ev) {
        ev.preventDefault();
        try {
            await axios.post("/register", {
                agentUsername,
                agentEmail,
                agentPassword,
            });
            alert("Registration successful. Now you can log in.");
        } catch (e) {
            alert("Registration failed. Please try again.");
        }
    }

    return (
        <div className="mt-4 grow flex items-center justify-around">
            <div className="mb-32">
                <h1 className="text-4xl text-center mb-4">Register</h1>
                <form className="max-w-md mx-auto" onSubmit={registerUser}>
                    <input type="text" 
                        placeholder="John Doe"
                        value={agentUsername}
                        onChange={ev => setAgentUsername(ev.target.value)}/>
                    <input type="email" 
                        placeholder="your@email.com"
                        value={agentEmail}
                        onChange={ev => setAgentEmail(ev.target.value)}/>
                    <input type="password" 
                        placeholder="************"
                        value={agentPassword}
                        onChange={ev => setAgentPassword(ev.target.value)}/>
                    <button className="primary">Register</button>
                    <div className="text-center py-2 text-gray-500">
                        Already a member? <Link className="underline text-black" to={'/login'}>Login</Link>
                    </div>
                </form>
            </div>
        </div>
    );
}