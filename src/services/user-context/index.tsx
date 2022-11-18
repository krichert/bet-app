import {useState, useEffect, useContext, createContext, FC, ReactNode} from "react";
import {getAuth, onAuthStateChanged, User} from 'firebase/auth';
import { DATABASE_URL } from "../../constants";

const UserContext = createContext<User & { nick: string, matches: any, winners: any, refresh: () => void } | null | undefined>(null);

export const UserContextProvider: FC<{children: ReactNode }>  = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [userData, setUserData] = useState<{ nick: string, matches: any, winners: any } | null>(null)

    const fetchUserData = () => {
        if (user) {
            fetch(`${DATABASE_URL}/users/${user.uid}.json`)
                .then(r => r.json())
                .then((data) => {
                    setUserData(data);
                })
        }
    }

    useEffect(() => {
        const auth = getAuth();
        onAuthStateChanged(auth, (user) => {
            setUser(user);
        });
    }, []);

    useEffect(() => {
        fetchUserData();
    }, [user])

    const contextValue = (!user || !userData) 
        ? null
        : {
            ...user,
            ...userData,
            refresh: fetchUserData
        }

    return (
        <UserContext.Provider value={contextValue}>
            {children}
        </UserContext.Provider>
    )
}

export const useUserContext = () => useContext(UserContext);