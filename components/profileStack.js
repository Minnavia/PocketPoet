import { createNativeStackNavigator } from "@react-navigation/native-stack"
import Profile from "../screens/Profile"
import TabNavigator from "./tabNavigator";
import DisplayPoem from "../screens/DisplayPoem";
import { List, Text, Button, IconButton } from "react-native-paper";
import { useRef, useState } from "react";
import { auth } from "../firebase.config";
import { StyleSheet, View } from "react-native";
import { AppBar } from "@react-native-material/core";
import Popover, { PopoverPlacement } from 'react-native-popover-view';
import FontAwesome from '@expo/vector-icons/FontAwesome';

const Stack = createNativeStackNavigator();

function HeaderLogo({navigation, route, options, back}) {
    
    const [showPopover, setShowPopover] = useState(false);

    const popoverRef = useRef();

    return (
      <View style={styles.container}>
        <AppBar
          title="PocketPoet"
          centerTitle={true}
          color='#8548dbff'
          leading={props => 
            <FontAwesome.Button 
              name="arrow-left" 
              onPress={() => navigation.goBack()}
              color={'white'}
              backgroundColor={'#8548dbff'}
              size={35}
              height={50}
              accessible={true}
              accessibilityLabel="Go back"
            >
            </FontAwesome.Button>
          }
          trailing={props => (
            <Popover          
              isVisible={showPopover}
              placement={PopoverPlacement.BOTTOM}
              onRequestClose={() => setShowPopover(false)}
              arrowSize={"0"}
              ref={popoverRef}
              from={(
                <IconButton 
                  icon="dots-vertical"
                  size={35}
                  iconColor="white"
                  onPress={() => setShowPopover(true)}
                  accessible={true}
                  accessibilityLabel="Menu"
                  accessibilityRole="menu"
                />
              )}>
              <Button 
                accessibilityRole="menuitem" 
                accessible={true} 
                onPress={() => {
                  navigation.navigate('Profile') 
                  popoverRef.current.requestClose()
                }}>Profile</Button>
              <Button 
                accessibilityRole="menuitem" 
                accessible={true} 
                onPress={() => auth.signOut()
                }>Sign out</Button>
            </Popover>
          )}
        >
        </AppBar>
      </View>
    )
  };

const ProfileNavigator = () => {
    return (
        <Stack.Navigator
            initialRouteName="Tabs"
            screenOptions={{header: (props) => <HeaderLogo{...props}/>}}
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

export default ProfileNavigator;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#8548dbff',
    paddingTop: 40
  },
  titleBox: {
    flex: 1,
    color: '#fff',
    fontSize: 20,
    alignItems: 'center',
    justifyContent:'center',
    height: '100%',
    height: 50
  },
  title: {
    color: '#fff',
    fontSize: 20,
    borderColor: '#14e24bff',
    borderWidth: 2,
    height: 30
  },
  action: {
    color: '#fff',
    fontSize: 16,
  },
  focusedIcon: {
    borderColor: '#16f24aff',
    borderWidth: 2
  }
});