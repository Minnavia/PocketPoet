import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LogIn from "../screens/logIn";
import SignUp from "../screens/SignUp";

const Stack = createNativeStackNavigator();

function AuthNavigator () {

    console.log('made it here');
    
    return (
        <Stack.Navigator initialRouteName="SignUp">
            <Stack.Screen 
                name="SignUp"
                component={SignUp}
            />
            <Stack.Screen 
                name="Login"
                component={LogIn}
            />
        </Stack.Navigator>
    )
}

export default AuthNavigator;