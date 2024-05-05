import { useContext, useEffect, useState, createContext } from "react";
import { onAuthStateChanged } from "firebase/auth";
import firebase from "firebase/compat/app";
import { auth, db } from "../firebase.config";
import { ref, onValue } from "firebase/database";

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({children}) {
    const [user, setUser] = useState(null);
    const [details, setDetails] = useState({});
    const [date, setDate] = useState(new Date());

    const getDetails = (user) => {
        try {
            console.log('trying to get details');
            const detailsRef = ref(db, `users/${user.uid}/details`);
            onValue(detailsRef, (snapshot) => {
                const data = snapshot.val();
                setDetails(data);
            });
            console.log('details', details);
        } catch(error) {
            console.log(error);
        }
    }

    const getDate = (user) => {
        try {
            console.log('trying to get date');
            const detailsRef = ref(db, `users/${user.uid}/date/`);
            onValue(detailsRef, (snapshot) => {
                const data = snapshot.val();
                setDate(JSON.parse(data));
            });
            console.log('date', date);
        } catch(error) {
            console.log(error);
        }
    }

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            console.log('Auth', currentUser.uid);
            setUser({...currentUser});
            getDetails(currentUser);
            getDate(currentUser);
        });
        return unsubscribe;
    }, []);

    const value = {
        user,
        setUser,
        details,
        date
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}