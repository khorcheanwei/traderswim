import axios from "axios";
import { createContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export const UserContext = createContext({});

export function UserContextProvider({ children }) {
  const [contextAgentUsername, setContextAgentUsername] = useState(null);
  const [isLogoutConfirmation, setIsLogoutConfirmation] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    async function updateAgentUsername() {
      if (contextAgentUsername == null) {
        await axios.get("/agent_account/profile").then(({ data }) => {
          if (data != null) {
            setContextAgentUsername(data.agentUsername);
          } else {
            navigate("/login");
          }
        });
      }
    }
    updateAgentUsername();
  }, []);

  return (
    <UserContext.Provider
      value={{
        contextAgentUsername,
        setContextAgentUsername,
        isLogoutConfirmation,
        setIsLogoutConfirmation,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}
