import { StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import TabNavigator from './components/tabNavigator';
import { auth } from './firebase.config';
import { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ActivityIndicator } from 'react-native-paper';
import AuthNavigator from './components/stackAuth';

const AuthenticatedUserContext = createContext({});

export default function App() {

  const [user, setUser] = useState(null);
  //const {user, setUser} = useContext(AuthenticatedUserContext);
  const [isLoading, setIsLoading] = useState(true);

  /*
  const AuthenticatedUserProvider = ({children}) => {
    const [user, setUser] = useState(null);
    return (
      <AuthenticatedUserContext.Provider value={{user, setUser}}>
        {children}
      </AuthenticatedUserContext.Provider>
    )
  }*/

  /*useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(
      auth,
      async (authenticatedUser) => {
        authenticatedUser ? setUser(authenticatedUser) : setUser(null);
        setIsLoading(false);
      }
    );
    return unsubscribeAuth;
  }, [user]);*/

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      console.log('user', user);
      setUser(user);
    });
  }, []);

  const User = auth.currentUser;

  /*if (isLoading) {
    return (
      <AuthenticatedUserProvider>
        <SafeAreaView style={styles.container}>
          <ActivityIndicator size='large' />
        </SafeAreaView>
      </AuthenticatedUserProvider>
    );
  }*/

  return (
      <NavigationContainer>
        {User ? <TabNavigator/> : <AuthNavigator/>}
      </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
