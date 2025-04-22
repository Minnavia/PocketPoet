import { useContext, useEffect, useState, createContext } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase.config";

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({children}) {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser({...currentUser});
        });
        return unsubscribe;
    }, []);

    const value = {
        user,
        setUser,
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}