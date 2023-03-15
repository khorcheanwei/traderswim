import axios from "axios";
import { createContext, useEffect } from "react";
import { useState} from 'react';

export const UserContext = createContext({});

export function UserContextProvider({children}) {
    const [contextAgentUsername, setContextAgentUsername] = useState(null);
    const [contextAgentID, setContextAgentID] = useState(null);
    const [ready, setReady] = useState(false);

    useEffect(() => {
        if (!contextAgentUsername) {
            axios.get("/agent_account/profile").then(({data}) =>{
                setContextAgentUsername(data.agentUsername);
                setContextAgentID(data.agentID)
                setReady(true);
            })  
        }
    }, [])
    
    return (
        <UserContext.Provider value={{contextAgentUsername, setContextAgentUsername, contextAgentID, setContextAgentID, ready, setReady}}>
            {children}
        </UserContext.Provider>
    );
}