import { Button, View, Text, TextInput, ActivityIndicator } from 'react-native'
import React, { useState, useEffect, useContext } from 'react'
import { useNavigation } from '@react-navigation/native'
import { AuthContext } from '../context/AuthContext';

import tw from 'twrnc';
import { useForm } from 'react-hook-form'
import axios from 'axios'
import VerifyEmail from './VerifyEmail'

import DatePicker from 'react-native-date-picker'

const BirthdayPicker = () => {
  const [date, setDate] = useState(new Date())

  return <DatePicker date={date} onDateChange={setDate} />
}

const TextField = ({ label, ...inputProps }) => {
  const [focused, setFocused] = useState(false);

  return (
    <View style={tw`w-full justify-center items-center mt-3`}>
      <Text style={tw`w-full pl-4 font-semibold text-base`}>{label}</Text>
      <TextInput style={tw`my-1 mb-1 border w-11/12 py-2 rounded bg-white px-2`}
        {...inputProps}
        onFocus={(e) => setFocused(true)}
        onBlur={(e) => setFocused(false)}
      />
    </View>
  )
}

const transformData = (dataStr) => {
  if (dataStr.length == 8) {
    var data = new Date(dataStr);
    console.log(data)
    let dataFormatada = ((dataStr.getDate())) + "/" + ((dataStr.getMonth() + 1)) + "/" + data.getFullYear();
    return dataFormatada
  } else {
    return dataStr
  }
}

const SignUp = () => {
  const navigation = useNavigation()
  const { login, error, isLoading, userInfo, userToken, register, setError } = useContext(AuthContext)
  const [email, setEmail] = useState(null)
  const [password, setPass] = useState(null)
  const [confirmPass, setConfirm] = useState(null)
  const [birthDate, setBirthDate] = useState(null)


  useEffect(() => {
    setError("")
  }, [])

  if (!userToken) {
    return (
      <View style={tw`flex-1 bg-white`}>
        <View style={tw`flex w-full h-2/12 justify-end`}>
          <Text style={tw`pt-6  text-3xl font-bold text-black text-center mb-2`}>Cadastro</Text>
        </View>
        {!!error && <Text style={tw`flex w-85 mt-6 text-center text-base font-semibold border rounded p-1 self-center`}>{error}</Text>}

        <View style={tw`flex w-full h-7/12 items-center justify-start px-3 pt-5`}>
          <TextField
            value={email}
            label={'Email'}
            onChangeText={text => {
              setEmail(text)
            }}
          />
          <TextField
            secureTextEntry={true}
            value={password}
            label={'Senha'}
            onChangeText={text => {
              setPass(text)
            }}
          />

          <TextField
            secureTextEntry={true}
            value={confirmPass}
            label={'Confirmar senha'}
            onChangeText={text => {
              setConfirm(text)
            }}
          />

          <TextField
            value={birthDate}
            label={'Data de aniversário'}
            onChangeText={text => {
              setBirthDate(text)
            }}
          />

        </View>
        <View  style={tw` w-full h-3/12 justify-start`}>
          <View
            style={tw`flex w-10/12 h-11 bg-red-600 justify-center items-center rounded-xl self-center`}
            onStartShouldSetResponder={() => {
              register(email, password, confirmPass, birthDate)
            }}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color="#FFF" />
            ) : (
              <Text style={tw`text-white`} >Cadastrar</Text>
            )}

          </View>
        </View>
      </View>
    )
  }
}

export default SignUp