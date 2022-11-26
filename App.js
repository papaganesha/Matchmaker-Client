import 'react-native-gesture-handler';
import tw from 'twrnc';
import React, { useState } from 'react'
import { View, Image } from 'react-native'
import { LogBox } from 'react-native';
import {  AuthProvider } from './context/AuthContext';
import AppNav from './navigation/AppNav'


//LogBox.ignoreLogs(['Warning: ...']); // Ignore log notification by message
LogBox.ignoreAllLogs();//Ignore all log notificatio

export default function App() {
  const [loading, setLoading] = useState(true)

  setTimeout(() => setLoading(false), 4000)

  if (loading) {
    return (
      <View style={tw`flex-1 justify-center items-center bg-white`}>
        <View style={tw`w-3/4 h-full`}>
          <Image resizeMode="contain" style={tw`w-full h-full`} source={require('./assets/logo.png')} />
        </View>
      </View>
    )
  }

  else {
    return (
      <AuthProvider>
        <AppNav />
      </AuthProvider>
    )
  }
}



