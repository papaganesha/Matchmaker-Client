import 'react-native-gesture-handler';
import tw from 'twrnc';


import React, { useContext } from 'react'
import { View, ActivityIndicator } from 'react-native'

import { AuthContext, AuthProvider } from './context/AuthContext';
import AppNav from './navigation/AppNav'


export default function App() {
  return(
    <AuthProvider>
      <AppNav/>
    </AuthProvider>
  )
}



