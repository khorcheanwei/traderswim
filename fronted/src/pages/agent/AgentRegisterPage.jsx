import { Link, Navigate } from 'react-router-dom';
import { useState } from 'react';
import axios from "axios";


export default function AgentRegisterPage() {
    const [agentUsername, setAgentUsername] = useState('');
    const [agentEmail, setAgentEmail] = useState('');
    const [agentPassword, setAgentPassword] = useState('');

    const [redirect, setRedirect] = useState(false)

    async function registerUser(event) {
        event.preventDefault();
        try {
            await axios.post("/agent_account/register/", {
                agentUsername,
                agentEmail,
                agentPassword,
            }).then(response => {
                alert(response.data);
                setRedirect(true)
            }).catch(err => {
                console.log(err);
            })
        } catch (error) {
            alert("Registration failed. Please try again.");
        }
    }

    if (redirect) {
        return <Navigate to={'/login'} />
    }

    return (
        <div className="mt-4 grow flex items-center justify-around">
            <div className="mb-32">
                <h1 className="text-4xl text-center mb-4">Register</h1>
                <form className="max-w-md mx-auto" onSubmit={registerUser}>
                    <input type="text"
                        placeholder="John Doe"
                        value={agentUsername}
                        onChange={event => setAgentUsername(event.target.value)} />
                    <input type="email"
                        placeholder="your@email.com"
                        value={agentEmail}
                        onChange={event => setAgentEmail(event.target.value)} />
                    <input type="password"
                        placeholder="************"
                        value={agentPassword}
                        onChange={event => setAgentPassword(event.target.value)} />
                    <button className="primary">Register</button>
                    <div className="text-center py-2 text-gray-500">
                        Already a member? <Link className="underline text-black" to={'/login'}>Login</Link>
                    </div>
                </form>
            </div>
        </div>
    );
}