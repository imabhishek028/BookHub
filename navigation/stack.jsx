import { View, Text } from 'react-native';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Login from '../screens/login';
import Register from '../screens/register';
import 'react-native-gesture-handler';
import Homescreen from '../screens/homescreen';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import UserProfile from '../screens/UserProfile';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { scale } from 'react-native-size-matters';
import MyBooks from '../screens/MyBooks';
import BuyHistory from '../screens/BuyHistory';
import Cart from '../screens/Cart';
import CreateBook from '../screens/CreateBook';
import Favourites from '../screens/Favourites';
import BookDetails from '../screens/BookDetails';
import CreatedBooksView from '../screens/createdBooksView';
import ChangePassword from '../screens/ChangePassword';
import ReviewBook from '../screens/ReviewBook';
import ForgotPassword from '../screens/ForgotPassword';
import Email from '../screens/Email';
import Reviews from '../screens/Reviews';

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
          height: scale(50),
        },
        tabBarActiveTintColor: '#041E42',
        tabBarLabelStyle: {
          fontSize: scale(11),
          fontWeight: 'bold'
        },
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = 'home';
            color = focused ? '#041E42' : 'gray';
          }
          else if (route.name === 'About Me') {
            iconName = 'user';
            color = focused ? '#041E42' : 'gray';
          }
          else if (route.name === 'MyBooks') {
            iconName = 'book';
            color = focused ? '#041E42' : 'gray';
          }

          return <FontAwesome5 name={iconName} size={scale(22)} color={color} />
        },
      })}
    >
      <Tab.Screen
        name='Home'
        component={Homescreen}
        options={{
          tabBarLabel: 'Home',
          title: 'BOOK SHELF',
          headerTintColor: '#041E42',
          headerTitleStyle: {
            fontWeight: 'bold',
            fontSize: scale(18),
          },
        }}
      />
      <Tab.Screen
        name='MyBooks'
        component={MyBooks}
        options={{
          tabBarLabel: 'My Books',
          title: 'MY BOOKS',
          headerTintColor: '#041E42',
          headerTitleStyle: {
            fontWeight: 'bold',
            fontSize: scale(18),
          },
        }}
      />
      <Tab.Screen
        name='About Me'
        component={UserProfile}
        options={{
          headerShown: false,
          tabBarLabel: 'Profile',
        }}
      />
    </Tab.Navigator>
  );
};

export default function StackNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='login'>
        <Stack.Screen name='login' component={Login} options={{ headerShown: false }} />
        <Stack.Screen name='register' component={Register} options={{ headerShown: false }} />
        <Stack.Screen name='BottomTabs' component={BottomTabs} options={{ headerShown: false }} />
        <Stack.Screen name='Cart' component={Cart} options={{ headerShown: false }} />
        <Stack.Screen name='ChangePassword'
         component={ChangePassword} 
         options={{
            headerShown:false
          }} />
        <Stack.Screen name='CreateBook'
          component={CreateBook}
          options={{
            tabBarLabel: 'My Books',
            title: 'Create Book',
            headerTintColor: '#041E42',
            headerTitleStyle: {
              fontWeight: 'bold',
              fontSize: scale(18),
            }
          }} />
           <Stack.Screen name='BookDetails'
          component={BookDetails}
          options={{
            tabBarLabel: 'Details',
            title: 'Details',
            headerTintColor: '#041E42',
            headerTitleStyle: {
              fontWeight: 'bold',
              fontSize: scale(18),
            }
          }} />
           <Stack.Screen name='CreatedBookView'
          component={CreatedBooksView}
          options={{
            tabBarLabel: 'My Collection',
            title: 'My Collection',
            headerTintColor: '#041E42',
            headerTitleStyle: {
              fontWeight: 'bold',
              fontSize: scale(18),
            }
          }} />
        <Stack.Screen name='BuyHistory' 
        component={BuyHistory} 
        options={{
            tabBarLabel: 'Buy History',
            title: 'Buy History',
            headerTintColor: '#041E42',
            headerTitleStyle: {
              fontWeight: 'bold',
              fontSize: scale(18),
            }
          }}  />

        <Stack.Screen name='Favourites'
         component={Favourites} 
         options={{
            tabBarLabel: 'Favourites',
            title: 'Favourites',
            headerTintColor: '#041E42',
            headerTitleStyle: {
              fontWeight: 'bold',
              fontSize: scale(18),
            }
          }} />
           <Stack.Screen name='Review'
         component={ReviewBook} 
         options={{
            tabBarLabel: 'Review',
            title: 'Review',
            headerTintColor: '#041E42',
            headerTitleStyle: {
              fontWeight: 'bold',
              fontSize: scale(18),
            }
          }} />
            <Stack.Screen name='Forgot Password'
         component={ForgotPassword} 
         options={{
            headerShown:false
          }}/>
          <Stack.Screen name='Email'
         component={Email} 
         options={{
            headerShown:false
          }}/>
            <Stack.Screen name='Reviews'
         component={Reviews} 
         options={{
          tabBarLabel: 'Reviews',
          title: 'Reviews',
          headerTintColor: '#041E42',
          headerTitleStyle: {
            fontWeight: 'bold',
            fontSize: scale(18),
          },
          }}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}
