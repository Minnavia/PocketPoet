import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import WritePoem from '../screens/WritePoem';
import StackNavigator from './stackHome';
import SearchNavigator from './stackSearch';

const Tab = createBottomTabNavigator();

function TabNavigator() {
  return (
    <Tab.Navigator initialRouteName='PocketPoet'>
      <Tab.Screen
          name='SearchStack'
          component={SearchNavigator}
      />
      <Tab.Screen 
          name="PocketPoet"
          component={StackNavigator}
      />
      <Tab.Screen 
          name="Write" 
          component={WritePoem}
          options={{headerTitle: 'PocketPoet'}}
      />
    </Tab.Navigator>
  );
}

export default TabNavigator;