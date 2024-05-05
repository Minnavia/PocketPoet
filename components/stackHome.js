import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import DisplayPoem from '../screens/DisplayPoem';
import Favourites from '../screens/Favourites';
import Profile from '../screens/Profile';

const Stack = createNativeStackNavigator();

const StackNavigator = () => {

    return (
      <Stack.Navigator 
        initialRouteName="Home"
        screenOptions={{headerShown: false}}
        >
         <Stack.Screen 
            name="Home" 
            component={HomeScreen}
        />
        <Stack.Screen
            name='Favourites'
            component={Favourites}
        />
      </Stack.Navigator>
    )
}

export default StackNavigator;