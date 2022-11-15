import { Button, View, Text, TextInput, ActivityIndicator, Image, KeyboardAvoidingView, ScrollView, StyleSheet, TouchableWithoutFeedback, Keyboard } from 'react-native'
import React, { useState, useEffect, useContext } from 'react'
import { useNavigation } from '@react-navigation/native'
import { AuthContext } from '../context/AuthContext';
import tw from 'twrnc';
import { useForm } from 'react-hook-form'
import axios from 'axios'
import SignUpNameAndCity from './SignUpNameAndCity'


const TextField = ({ label, ...inputProps }) => {
  const [focused, setFocused] = useState(false);

  return (
    <View style={tw`w-full justify-center items-center mt-4`}>
      <Text style={tw`w-full pl-8 font-semibold text-base`}>{label}</Text>
      <TextInput style={tw`my-2 border w-5/6 py-2 rounded bg-white px-2`}
        {...inputProps}
        onFocus={(e) => setFocused(true)}
        onBlur={(e) => setFocused(false)}
      />
    </View>
  )
}





const SignIn = () => {
  const navigation = useNavigation()
  const { login, error, isLoading, userInfo, userToken, logout, setError } = useContext(AuthContext)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  useEffect(()=>{
    setError("")
  },[])

  if (!userToken) {
    return (
      <View
        style={tw`flex-1 w-full h-full bg-white`}
      >
        <View style={tw`flex w-full h-4/12 items-center justify-center pt-5 `}>
          <Image style={tw`w-3/6 h-4/6`} source={require('../assets/logo.png')} />
        </View>
        <View style={tw`flex w-full h-full items-center bg-gray-200 rounded-3xl`}>
          <Text style={tw`pt-4 text-3xl font-bold text-black text-center mt-6 mb-2`}>Entrar</Text>
          {!!error && <Text style={tw`flex w-82 mt-4 mb-3 text-center text-base font-semibold border rounded p-1`}>{error}</Text>}
          <TextField
            label={'Email'}
            value={email}
            onChangeText={text => {
              //console.log(text)
              setEmail(text)
            }}
          />
          <TextField
            secureTextEntry={true}
            label={'Senha'}
            value={password}
            onChangeText={text => {
              setPassword(text)
            }}
          />
          {/*DIV/TEXTO/ESQUECEU A SENHA*/}
          <View style={tw`flex w-full text-left items-end px-8`}>
            <Text style={tw`font-semibold `}>Esqueceu a senha?</Text>
          </View>

          {/*DIV/COM FUNÇÃO DE BOTÃO/REALIZAR LOGIN*/}
          <View
            style={tw`flex w-10/12 h-11 bg-red-600 justify-center items-center rounded-xl mt-12`}
            onStartShouldSetResponder={() => {
              login(email, password)
            }}
            >
            {isLoading ? (
              <ActivityIndicator size="small" color="#FFF" />
            ) : (
              <Text  style={tw`text-white`} >Entrar</Text>
            )}

          </View>
        </View>
      </View>
    )
  }
}

export default SignIn


