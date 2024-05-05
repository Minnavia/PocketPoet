import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import WritePoem from '../screens/WritePoem';
import { BottomNavigation } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';
import { CommonActions } from '@react-navigation/native';
import { FontAwesome6 } from '@expo/vector-icons';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { StyleSheet } from 'react-native';
import SearchPoems from '../screens/SearchPoems';
import Favourites from '../screens/Favourites';
import HomeScreen from '../screens/HomeScreen';

const Tab = createBottomTabNavigator();

function TabNavigator() {
  return (
    <Tab.Navigator 
        screenOptions={{
          headerShown: false
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
          component={HomeScreen}
          options={{
            tabBarLabel: 'Home',
            tabBarIcon: ({color, size}) => {
              return <MaterialIcons name='home' size={size} color={color}/>
            }
          }}
      />
      <Tab.Screen
          name="Favourites"
          component={Favourites}
          options={{
            tabBarLabel: 'Favourites',
            tabBarIcon: ({color, size}) => {
              return <FontAwesome name='heart' size={size} color={color}/>
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