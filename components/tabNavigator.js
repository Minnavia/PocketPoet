import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { BottomNavigation } from 'react-native-paper';
import { CommonActions, useLinkBuilder, useTheme } from '@react-navigation/native';
import { FontAwesome6 } from '@expo/vector-icons';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { StyleSheet, View } from 'react-native';
import SearchPoems from '../screens/SearchPoems';
import HomeScreen from '../screens/HomeScreen';
import Favourites from '../screens/Favourites';
import GlobalStyles from '../constants/GlobalStyles';
import { PlatformPressable } from '@react-navigation/elements';

const Tab = createBottomTabNavigator();

function CustomTabs({state, descriptors, navigation}) {
  const {colors} = useTheme();
  const {buildHref} = useLinkBuilder();
  
  return (
    <View style={{flexDirection: 'row'}}>
      {state.routes.map((route, index) => {
        const {options} = descriptors[route.key];
        const label = options.tabBarLabel !== undefined
          ? options.tabBarLabel
          : options.title !== undefined
            ? options.title
            : route.name;

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        };

        return (
          <PlatformPressable
            key={route.key}
            href={buildHref(route.name, route.params)}
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarButtonTestID}
            onPress={onPress}
            onLongPress={onLongPress}
            style={{flex: 1}}
          >
            <Text style={{color: isFocused ? colors.primary : colors.text}}>
              {label}
            </Text>
          </PlatformPressable>
        )
      })}
    </View>
  )
};

function MyTabs() {
  return (
    <Tab.Navigator
      initialRouteName='Home'
      
    >
      <Tab.Screen 
        name="Search" 
        component={SearchPoems}/>
      <Tab.Screen 
        name="Home" 
        component={HomeScreen}/>
      <Tab.Screen 
        name="Favourites" 
        component={Favourites}/>
    </Tab.Navigator>
  );
};

function TabNavigator() {
  return (
    <Tab.Navigator 
        screenOptions={{
          headerShown: false,
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
              return <FontAwesome name='search' size={size} color={color}/>;
            }
          }}
      />
      <Tab.Screen 
          name="PocketPoet"
          component={HomeScreen}
          options={{
            tabBarLabel: 'Home',
            tabBarIcon: ({color, size}) => {
              return <FontAwesome6 name='house' size={size} color={color}/>
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
    </Tab.Navigator>
  );
}

export default TabNavigator;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'pink',
    alignItems: 'center',
    justifyContent: 'center',
  },
});