import axios from "axios";
import { createContext, useEffect } from "react";
import { Link , Navigate} from 'react-router-dom';
import { useState} from 'react';
import { Cookies } from 'react-cookie';

export const UserContext = createContext({});

export function UserContextProvider({children}) {
    const [contextAgentUsername, setContextAgentUsername] = useState(null);
    const [ready, setReady] = useState(false);

    useEffect(() => {
        if (contextAgentUsername != null) {
            axios.get("/agent_account/profile").then(({data}) =>{
                console.log(data)
                if (data != null) {
                    setContextAgentUsername(data.agentUsername);
                    
                }
                
            })  
        }
    }, [])

    const cookies = new Cookies();
    //console.log(cookies.token)
    /*
    if (cookie.token == undefined) {
        return <Navigate to={'/login'} />
    }*/
    
    return (
        <UserContext.Provider value={{contextAgentUsername, setContextAgentUsername, ready, setReady}}>
            {children}
        </UserContext.Provider>
    );
}