import { ActivityIndicator } from 'react-native'

import React, { useContext, useEffect } from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import Home from '../screens/Home';
import SignUpGender from '../screens/SignUpGender'

import SignUpInterests from '../screens/SignUpInterests'
import SignUpNameAndCity from '../screens/SignUpNameAndCity'
import SignUpOrientation from '../screens/SignUpOrientation'
import SignUpPics from '../screens/SignUpPics'
import EnableNotifications from '../screens/EnableNotifications'
import ProfileUserOnScreen from '../screens/ProfileUserOnScreen'
import MatchAnimation from '../screens/MatchAnimation'
import MessagesScreen from '../screens/MessagesScreen'




import { AuthContext } from '../context/AuthContext';


const Stack = createStackNavigator();

const RegisterStack = () => {
  const { userInfo, refreshUserInfo, isLoading } = useContext(AuthContext)

  useEffect(() => {
    refreshUserInfo()
  }, [])

      return (
        <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName='SignUpNameAndCity'>
          <Stack.Screen name="SignUpNameAndCity" component={SignUpNameAndCity} />
          <Stack.Screen name="SignUpGender" component={SignUpGender} />
          <Stack.Screen name="SignUpOrientation" component={SignUpOrientation} />
          <Stack.Screen name="SignUpPics" component={SignUpPics} />
          <Stack.Screen name="SignUpInterests" component={SignUpInterests} />
          <Stack.Screen name="EnableNotifications" component={EnableNotifications} />


        </Stack.Navigator>
      )

    
}

export default RegisterStack