import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import DisplayPoem from '../screens/DisplayPoem';
import Favourites from '../screens/Favourites';

const Stack = createNativeStackNavigator();

const StackNavigator = () => {
   
    return (
      <Stack.Navigator initialRouteName="Home">
         <Stack.Screen 
            name="Home" 
            component={HomeScreen}
            options={{headerShown: false}}
        />
         <Stack.Screen 
            name='Poem'
            component={DisplayPoem} 
            options={{headerShown: false}}
        />
        <Stack.Screen
            name='Favourites'
            component={Favourites}
            options={{headerShown: false}}
        />
      </Stack.Navigator>
    )
}

export default StackNavigator;