import axios from "axios";
import { createContext, useEffect } from "react";
import { Link , Navigate} from 'react-router-dom';
import { useState} from 'react';

export const UserContext = createContext({});

export function UserContextProvider({children}) {
    const [contextAgentUsername, setContextAgentUsername] = useState(null);
    const [isLogoutConfirmation, setIsLogoutConfirmation] = useState(false);

    useEffect(() => {
        async function updateAgentUsername() {
            if (contextAgentUsername == null) {
                await axios.get("/agent_account/profile").then(({data}) =>{
                    if (data != null) {
                        setContextAgentUsername(data.agentUsername);
                    } 
                })  
            }
        }
        updateAgentUsername()   
    }, [])
    
    return (
        <UserContext.Provider value={{contextAgentUsername, setContextAgentUsername, isLogoutConfirmation, setIsLogoutConfirmation}}>
            {children}
        </UserContext.Provider>
    );
}