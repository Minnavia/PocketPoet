import { createNativeStackNavigator } from "@react-navigation/native-stack"
import Profile from "../screens/Profile"
import TabNavigator from "./tabNavigator";
import DisplayPoem from "../screens/DisplayPoem";
import { Appbar, Menu } from "react-native-paper";
import { useState } from "react";

const Stack = createNativeStackNavigator();

function HeaderLogo({navigation, route, options, back}) {
  
    const [visible, setVisible] = useState(false);
    const openMenu = () => setVisible(true);
    const closeMenu = () => setVisible(false);
  
    return (
        <Appbar.Header>
          {back ? <Appbar.BackAction onPress={navigation.goBack} /> : null}
          <Appbar.Content title='PocketPoet'/>
          <Menu
            visible={visible}
            onDismiss={closeMenu}
            anchor={
              <Appbar.Action
                icon="dots-vertical"
                onPress={openMenu}
              />
            }
          >
            <Menu.Item
              title="Settings"
              onPress={() => navigation.navigate('Profile')}
            />
            <Menu.Item
              title="Log out"
              onPress={() => auth.signOut()}
            />
          </Menu>
        </Appbar.Header>
    )
  };

const ProfileNavigator = () => {
    return (
        <Stack.Navigator
            initialRouteName="Tabs"
            screenOptions={{header: (props) => <HeaderLogo {...props}/>}}
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