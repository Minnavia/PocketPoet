import { NavigationContainer } from '@react-navigation/native';
import TabNavigator from './components/tabNavigator';
import { auth } from './firebase.config';
import { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ActivityIndicator } from 'react-native-paper';
import AuthNavigator from './components/stackAuth';
import { AuthProvider, useAuth } from './contexts/authContext';
import HomeScreen from './screens/HomeScreen';

export default function App() {

    const [User, setUser] = useState(null);
    //const User = auth.currentUser;

    //const User = auth.currentUser;

    useEffect(() => {
      onAuthStateChanged(auth, (user) => {
        if (user) {
          setUser(user);
        } else {
          setUser(null);
        }
      });
    }, [])
    /*onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
    });*/

    console.log('app ', User);

    return (
      <AuthProvider>
        <NavigationContainer>
            {User ? <TabNavigator/> : <AuthNavigator/>}
        </NavigationContainer>
      </AuthProvider>
    )
};