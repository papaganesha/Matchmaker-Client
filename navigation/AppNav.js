import { View, Text, ActivityIndicator } from 'react-native'
import React, { useContext } from 'react'

import { NavigationContainer } from '@react-navigation/native';
import tw from 'twrnc';

import { AuthContext } from '../context/AuthContext';

import AuthStack from './AuthStack'
import AppStack from './AppStack'
import RegisterStack from './RegisterStack';

const AppNav = () => {
    const { isLoading, userToken, userInfo } = useContext(AuthContext)
    if (isLoading) {
        return (
            <View style={tw`flex-1 justify-center items-center`}>
                <ActivityIndicator size={30} />
            </View>
        )
    } else if (userToken && userInfo.firstLogin) {
        return (
            <NavigationContainer>
                <RegisterStack />
            </NavigationContainer>
        )
    }
    else if (userToken && !userInfo.firstLogin) {
        return (
            <NavigationContainer>
                <AppStack />
            </NavigationContainer>
        )
    } else {
        return (
            <NavigationContainer>
                <AuthStack />
            </NavigationContainer>
        )
    }


}

export default AppNav