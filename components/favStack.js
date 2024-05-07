import { createNativeStackNavigator } from "@react-navigation/native-stack"
import MyPoems from "../screens/MyPoems";
import Favourites from "../screens/Favourites";

const Stack = createNativeStackNavigator();

const FavouritesNavigator = () => {
    return (
        <Stack.Navigator
            initialRouteName="Fav"
            screenOptions={{headerShown: false}}
        >
            <Stack.Screen
                name='Own'
                component={MyPoems}
            />
            <Stack.Screen
                name="Fav"
                component={Favourites}
            />
        </Stack.Navigator>
    )
}

export default FavouritesNavigator;