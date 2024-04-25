import { useContext, useEffect, useState, createContext } from "react";
import { onAuthStateChanged } from "firebase/auth";
import firebase from "firebase/compat/app";
import { auth } from "../firebase.config";

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({children}) {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            console.log('Auth', user);
            setUser({...user});
        });
        return unsubscribe;
    }, []);

    const value = {
        user,
        setUser
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}