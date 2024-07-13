import { View, Text } from 'react-native';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Login from '../screens/login';
import Register from '../screens/register';
import 'react-native-gesture-handler';
import Homescreen from '../screens/homescreen';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import FilterBooks from '../screens/FilterBooks';
import UserProfile from '../screens/UserProfile';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import { scale } from 'react-native-size-matters';
import MyBooks from '../screens/MyBooks';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const BottomTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarStyle: {
          backgroundColor: '#EDEADE',
          paddingBottom: scale(5),
          paddingTop: scale(5),
          height:scale(50),
        },
        tabBarActiveTintColor: '#041E42',
        tabBarLabelStyle: {
          fontSize: scale(11),
          fontWeight:'bold'
        },
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = 'home';
            color = focused ? '#041E42' : 'gray';
          } else if (route.name === 'Filter Books') {
            iconName = 'filter';
            color = focused ? '#041E42' : 'gray';
          } else if (route.name === 'About Me') {
            iconName = 'user';
            color = focused ? '#041E42' : 'gray';
          }
          else if (route.name === 'MyBooks') {
            iconName = 'book';
            color = focused ? '#041E42' : 'gray';
          }

          if (route.name === 'Filter Recipes') {
            return <FontAwesome6 name={iconName} size={scale(22)} color={color} />;
          } else {
            return <FontAwesome5 name={iconName} size={scale(22)} color={color} />;
          }
        },
      })}
    >
      <Tab.Screen
        name='Home'
        component={Homescreen}
        options={{
          tabBarLabel: 'Home',
          title:'BOOK SHELF',
          headerTintColor: '#041E42',
          headerTitleStyle: {
            fontWeight: 'bold',
            fontSize:scale(18),
          },
        }}
      />
       <Tab.Screen
        name='MyBooks'
        component={MyBooks}
        options={{
          tabBarLabel: 'My Books',
          title:'MY BOOKS',
          headerTintColor: '#041E42',
          headerTitleStyle: {
            fontWeight: 'bold',
            fontSize:scale(18),
          },
        }}
      />
      <Tab.Screen
        name='Filter Books'
        component={FilterBooks}
        options={{
          tabBarLabel: 'Filter Books',
        }}
      />
      <Tab.Screen
        name='About Me'
        component={UserProfile}
        options={{
          headerShown:false,
          tabBarLabel: 'Profile',
        }}
      />
    </Tab.Navigator>
  );
};

export default function StackNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='BottomTabs'>
        {/* <Stack.Screen name='login' component={Login} options={{headerShown:false}}/>
            <Stack.Screen name='register' component={Register} options={{headerShown:false}}/> */}
        <Stack.Screen name='BottomTabs' component={BottomTabs} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
