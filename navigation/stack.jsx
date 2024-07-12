import { View, Text } from 'react-native'
import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import Login from '../screens/login'
import Register from '../screens/register'
import 'react-native-gesture-handler';
import Homescreen from '../screens/homescreen'


const Stack=createStackNavigator()

export default function StackNavigator() {
  return (
    <NavigationContainer>
        <Stack.Navigator>
            <Stack.Screen name='login' component={Login} options={{headerShown:false}}/>
            <Stack.Screen name='register' component={Register} options={{headerShown:false}}/>
            <Stack.Screen name='home' component={Homescreen} options={{headerShown:false}}/>
        </Stack.Navigator>
    </NavigationContainer>
  )
}