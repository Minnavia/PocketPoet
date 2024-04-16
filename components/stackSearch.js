import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SearchPoems from '../screens/SearchPoems';
import DisplayPoem from '../screens/DisplayPoem';

const Stack = createNativeStackNavigator();

const SearchNavigator = () => {
    return (
    <Stack.Navigator initialRouteName='Search'>
        <Stack.Screen 
            name='Search'
            component={SearchPoems}/>
        <Stack.Screen 
            name='Read'
            component={DisplayPoem}
            options={{headerShown: false}}/>
    </Stack.Navigator>
    )
}

export default SearchNavigator;