import axios from "axios";
import { createContext, useEffect, useState } from "react";

/* makes sure login information is transferred from page to page */
export const UserContext = createContext({});

export function UserContextProvider({children}) {
    const [user, setUser] = useState(null);
    const [ready, setReady] = useState(false);
    useEffect(() => { //THIS WILL GET CALLED TWICE IN DEVELOPMENT MODE (on mount)
        if (!user) { //populate data if there is none
            axios.get("/profile").then(({data}) => {
                setUser(data)
                setReady(true)
            }) //user logged in
        }
    }, [])
    return (
        <UserContext.Provider value={{user, setUser, ready}}>
            {children}
        </UserContext.Provider>
    )
}

