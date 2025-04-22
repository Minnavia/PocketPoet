import { NavigationContainer } from '@react-navigation/native';
import { auth } from './firebase.config';
import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { PaperProvider } from 'react-native-paper';
import AuthNavigator from './components/stackAuth';
import { AuthProvider } from './contexts/authContext';
import ProfileNavigator from './components/profileStack';

export default function App() {

    const [User, setUser] = useState(null);

    useEffect(() => {
      onAuthStateChanged(auth, (user) => {
        if (user) {
          setUser(user);
        } else {
          setUser(null);
        }
      });
    }, [])

    return (
      <AuthProvider>
          <SafeAreaProvider>
            <PaperProvider>
              <NavigationContainer>
                  {User ? <ProfileNavigator/> : <AuthNavigator/>}
              </NavigationContainer>
            </PaperProvider>
          </SafeAreaProvider>
      </AuthProvider>
    )
};