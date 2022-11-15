import { ActivityIndicator } from 'react-native'

import React, { useContext, useEffect } from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import Home from '../screens/Home';
import VerifyEmail from '../screens/VerifyEmail';
import SignUpGender from '../screens/SignUpGender'

import SignUpInterests from '../screens/SignUpInterests'
import SignUpNameAndCity from '../screens/SignUpNameAndCity'
import SignUpOrientation from '../screens/SignUpOrientation'
import SignUpPics from '../screens/SignUpPics'
import EnableNotifications from '../screens/EnableNotifications'
import ProfileUserOnScreen from '../screens/ProfileUserOnScreen'
import MatchAnimation from '../screens/MatchAnimation'
import ChatScreen from '../screens/ChatScreen'
import MessagesScreen from '../screens/MessagesScreen'




import { AuthContext } from '../context/AuthContext';


const Stack = createStackNavigator();

const AppStack = () => {
  const { userInfo, refreshUserInfo, isLoading } = useContext(AuthContext)

  useEffect(() => {
    refreshUserInfo()
  }, [])

  if (isLoading) {
    return(
      <View>
          <ActivityIndicator size="small" color="#FFF" />
      </View>
    )
  } else {
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
    } else{
      return (
        <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName='Home'>
          <Stack.Screen name="Home" component={Home} />
          <Stack.Screen name="ProfileUserOnScreen" component={ProfileUserOnScreen} />
          <Stack.Screen name="MatchAnimation" component={MatchAnimation} />
          <Stack.Screen name="ChatScreen" component={ChatScreen} />
          <Stack.Screen name="MessagesScreen" component={MessagesScreen} />

        </Stack.Navigator>
      )

    }
  }

};

export default AppStack;