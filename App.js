import { NavigationContainer } from '@react-navigation/native';
import TabNavigator from './components/tabNavigator';
import { auth } from './firebase.config';
import { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { ActivityIndicator, DefaultTheme, PaperProvider } from 'react-native-paper';
import AuthNavigator from './components/stackAuth';
import { AuthProvider, useAuth } from './contexts/authContext';
import HomeScreen from './screens/HomeScreen';
import ProfileNavigator from './components/profileStack';

export default function App() {

    const [User, setUser] = useState(null);
 
    const theme = {
      ...DefaultTheme,
      colors: {
        ...DefaultTheme.colors,
        red: 'FF6969'
      }
    }

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
            <PaperProvider theme={theme}>
              <NavigationContainer>
                  {User ? <ProfileNavigator/> : <AuthNavigator/>}
              </NavigationContainer>
            </PaperProvider>
          </SafeAreaProvider>
      </AuthProvider>
    )
};