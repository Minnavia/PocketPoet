import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import WritePoem from '../screens/WritePoem';
import StackNavigator from './stackHome';
import { Appbar, BottomNavigation, Menu, Text } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';
import { CommonActions } from '@react-navigation/native';
import { FontAwesome6 } from '@expo/vector-icons';
import { StyleSheet, View } from 'react-native';
import SearchPoems from '../screens/SearchPoems';
import { useState } from 'react';
import App from '../App';
import { auth } from '../firebase.config';

const Tab = createBottomTabNavigator();

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

function TabNavigator() {
  return (
    <Tab.Navigator 
        screenOptions={{
          header: (props) => <HeaderLogo {...props}/>
        }}
        initialRouteName='PocketPoet'
        tabBar={({navigation, state, descriptors, insets}) => (
          <BottomNavigation.Bar
              navigationState={state}
              safeAreaInsets={insets}
              onTabPress={({route, preventDefault}) => {
                const event = navigation.emit({
                  type: 'tabPress',
                  target: route.key,
                  canPreventDefault: true,
                });

                if (event.defaultPrevented) {
                  preventDefault();
                } else {
                  navigation.dispatch({
                    ...CommonActions.navigate(route.name, route.params),
                    target: state.key,
                  });
                }
              }}
              renderIcon={({route, focused, color}) => {
                const {options} = descriptors[route.key];
                if (options.tabBarIcon) {
                  return options.tabBarIcon({focused, color, size: 24});
                }
                return null;
              }}
              getLabelText={({route}) => {
                const {options} = descriptors[route.key];
                const label =
                  options.tabBarLabel !== undefined
                  ? options.tabBarLabel
                  : options.title !== undefined
                  ? options.title
                  : route.title;
                return label;
              }}
          />
        )}>
      <Tab.Screen
          name='Search'
          component={SearchPoems}
          options={{
            tabBarLabel: 'Search',
            tabBarIcon: ({color, size}) => {
              return <MaterialIcons name='search' size={size} color={color}/>;
            }
          }}
      />
      <Tab.Screen 
          name="PocketPoet"
          component={StackNavigator}
          options={{
            tabBarLabel: 'Home',
            tabBarIcon: ({color, size}) => {
              return <MaterialIcons name='home' size={size} color={color}/>
            }
          }}
      />
      <Tab.Screen 
          name="Write" 
          component={WritePoem}
          options={{
            tabBarLabel: 'Write',
            tabBarIcon: ({color, size}) => {
              return <FontAwesome6 name='feather-pointed' size={size} color={color}/>
            }
          }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'pink',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default TabNavigator;