import React, {useContext} from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import FirstScreen from '../screens/FirstScreen';

import SignIn from '../screens/SignIn';
import SignUp from '../screens/SignUp';



import { AuthContext } from '../context/AuthContext';


const Stack = createStackNavigator();

const AuthStack = () => {
  const { login, error, isLoading, userInfo, logout} = useContext(AuthContext)

  return (
    <Stack.Navigator screenOptions={{headerShown: false, headerMode: false}}  initialRouteName='FirstScreen'>
      <Stack.Screen name="FirstScreen" component={FirstScreen} />
      <Stack.Screen name="SignUp" component={SignUp} />
      <Stack.Screen name="SignIn" component={SignIn} />
    </Stack.Navigator>
  );
};

export default AuthStack;