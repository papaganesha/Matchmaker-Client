import { View, Text, ActivityIndicator } from 'react-native'
import React, {useContext} from 'react'

import { NavigationContainer } from '@react-navigation/native';
import tw from 'twrnc';

import { AuthContext } from '../context/AuthContext';

import AuthStack from './AuthStack'
import AppStack from './AppStack'

const AppNav = () => {
    const {isLoading, userToken, userInfo} = useContext(AuthContext)
    if(isLoading){
        return(
            <View style={tw`flex-1 justify-center items-center`}>
                <ActivityIndicator size={'large'}/>
            </View>
        )
    }
    return (
        <NavigationContainer>
            {userToken !== null ? <AppStack/> : <AuthStack/>}
        </NavigationContainer>
    )
}

export default AppNav