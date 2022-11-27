import {  View, Text, TextInput, ActivityIndicator, Image, TouchableOpacity} from 'react-native'
import React, { useState, useEffect, useContext } from 'react'
import { useNavigation } from '@react-navigation/native'
import { AuthContext } from '../context/AuthContext';
import tw from 'twrnc';


const TextField = ({ label, ...inputProps }) => {
  const [focused, setFocused] = useState(false);

  return (
    <View style={tw`w-full justify-center items-center mt-4`}>
      <Text style={tw`w-full pl-8 font-semibold text-base`}>{label}</Text>
      <TextInput style={tw`my-2 border w-5/6 py-2 rounded bg-white px-3 shadow-lg`}
        {...inputProps}
        onFocus={(e) => setFocused(true)}
        onBlur={(e) => setFocused(false)}
      />
    </View>
  )
}


const SignIn = () => {
  const navigation = useNavigation()
  const { login, error, userInfo, userToken, logout, setError } = useContext(AuthContext)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(()=>{
    setError("")
  },[])


  useEffect(()=>{
    console.log(loading)
  },[loading])

  const RenderButton = () => {
    if(loading){
      return(
        <ActivityIndicator size={15} color="#FFF" />
      )
    }else{
      return(
        <Text  style={tw`text-white font-semibold`} >Entrar</Text>
      )
    }
  }

  if (!userToken) {
    return (
      <View
        style={tw`flex-1 w-full h-full bg-white`}
      >
        <View style={tw`flex w-full h-4/12 items-center justify-center`}>
          <Image style={tw`w-3/6 h-4/6`} source={require('../assets/logo.png')} />
        </View>
        <View style={tw`flex w-full h-full items-center bg-gray-200 rounded-3xl`}>
          <Text style={tw`pt-4 text-2xl font-bold text-black text-center mt-2 mb-2`}>Entrar</Text>
          {!!error && <Text style={tw`flex w-82 mt-3 mb-2 text-center text-base font-semibold border rounded-lg p-1`}>{error}</Text>}
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
          <TouchableOpacity
            style={tw`flex w-10/12 h-11 bg-red-600 justify-center items-center rounded-lg mt-10 shadow-lg`}
            onPress={() => {
              login(email, password, setLoading)

            }}
            >
            <RenderButton/>

          </TouchableOpacity>
        </View>
      </View>
    )
  }
}

export default SignIn


