import axios from "axios";
import { createContext, useEffect } from "react";
import { Link , Navigate} from 'react-router-dom';
import { useState} from 'react';
import { useCookies } from "react-cookie";

export const UserContext = createContext({});

export function UserContextProvider({children}) {
    const [contextAgentUsername, setContextAgentUsername] = useState(null);
    const [contextAgentID, setContextAgentID] = useState(null);
    const [isOpenAccountLogin, setIsOpenAccountLogin] = useState(false);
    const [ready, setReady] = useState(false);

    const[cookie,setCookie,removeCookie] = useCookies(['']);

    useEffect(() => {
        if (!contextAgentUsername) {
            axios.get("/agent_account/profile").then(({data}) =>{
                if (data != null) {
                    setContextAgentUsername(data.agentUsername);
                    setContextAgentID(data.agentID)
                    //setReady(true);
                }
                
            })  
        }
    }, [])

    /*
    if (cookie.token == undefined) {
        return <Navigate to={'/login'} />
    }*/
    
    return (
        <UserContext.Provider value={{contextAgentUsername, setContextAgentUsername, contextAgentID, setContextAgentID, isOpenAccountLogin, setIsOpenAccountLogin, ready, setReady}}>
            {children}
        </UserContext.Provider>
    );
}