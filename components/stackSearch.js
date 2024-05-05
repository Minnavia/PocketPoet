import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SearchPoems from '../screens/SearchPoems';
import DisplayPoem from '../screens/DisplayPoem';
import Profile from '../screens/Profile';

const Stack = createNativeStackNavigator();

const SearchNavigator = () => {
    return (
        <Stack.Navigator 
            initialRouteName='Search'
            screenOptions={{headerShown: false}}
            >
            <Stack.Screen 
                name='Search'
                component={SearchPoems}
            />
            <Stack.Screen 
                name='Read'
                component={DisplayPoem}
            />
        </Stack.Navigator>
    )
}