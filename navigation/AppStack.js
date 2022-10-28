import React, { useContext } from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import Home from '../screens/Home';
import VerifyEmail from '../screens/VerifyEmail';
import SignUpGender from '../screens/SignUpGender'

import SignUpInterests from '../screens/SignUpInterests'
import SignUpNameAndCity from '../screens/SignUpNameAndCity'
import SignUpOrientation from '../screens/SignUpOrientation'
import SignUpPics from '../screens/SignUpPics'
import EnableNotifications from '../screens/EnableNotifications'

import { AuthContext } from '../context/AuthContext';


const Stack = createStackNavigator();

const AppStack = () => {
  const { userInfo } = useContext(AuthContext)

  if (userInfo.firstLogin) {
    return (
      <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName='SignUpNameAndCity'>
        <Stack.Screen name="VerifyEmail" component={VerifyEmail} />
        <Stack.Screen name="SignUpNameAndCity" component={SignUpNameAndCity} />
        <Stack.Screen name="SignUpGender" component={SignUpGender} />
        <Stack.Screen name="SignUpOrientation" component={SignUpOrientation} />
        <Stack.Screen name="SignUpPics" component={SignUpPics} />
        <Stack.Screen name="SignUpInterests" component={SignUpInterests} />
        <Stack.Screen name="EnableNotifications" component={EnableNotifications} />
      </Stack.Navigator>
    )
  } {
    return (
      <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName='Home'>
        <Stack.Screen name="Home" component={Home} />
      </Stack.Navigator>
    )

  }
};

export default AppStack;