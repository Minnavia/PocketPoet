import { createNativeStackNavigator } from "@react-navigation/native-stack"
import Profile from "../screens/Profile"
import TabNavigator from "./tabNavigator";
import DisplayPoem from "../screens/DisplayPoem";

const Stack = createNativeStackNavigator();

const ProfileNavigator = () => {
    return (
        <Stack.Navigator
            initialRouteName="Tabs"
            screenOptions={{headerShown: false}}
        >
            <Stack.Screen
                name="Profile"
                component={Profile}
            />
            <Stack.Screen
                name="Tabs"
                component={TabNavigator}
            />
            <Stack.Screen
                name="Read"
                component={DisplayPoem}
            />
        </Stack.Navigator>
    )
}

export default ProfileNavigator