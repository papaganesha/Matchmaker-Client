import { View, Text, TextInput, ActivityIndicator } from 'react-native'
import {TouchableOpacity} from "react-native-gesture-handler"
import React, { useState, useEffect, useContext } from 'react'
import { AuthContext } from '../context/AuthContext';

import tw from 'twrnc';
import DateTimePicker from '@react-native-community/datetimepicker';



const TextField = ({ label, ...inputProps }) => {
  const [focused, setFocused] = useState(false);

  return (
    <View style={tw`w-full justify-center items-center mt-3`}>
      <Text style={tw`w-full pl-4 font-semibold text-base`}>{label}</Text>
      <TextInput style={tw`my-1 mb-1 border w-11/12 py-2 rounded bg-white px-2 shadow-lg`}
        {...inputProps}
        onFocus={(e) => setFocused(true)}
        onBlur={(e) => setFocused(false)}
      />
    </View>
  )
}

const SignUp = () => {
  const { error, isLoading, userToken, register, setError } = useContext(AuthContext)
  const [email, setEmail] = useState(null)
  const [password, setPass] = useState(null)
  const [confirmPass, setConfirm] = useState(null)
  const [birthDate, setBirthDate] = useState(new Date("January 1, 1950"))

  //Métodos do DateTimePicker
  const [show, setShow] = useState(false);
  const [mode, setMode] = useState('date');

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || birthDate;
    setShow(Platform.OS === 'ios');
    setBirthDate(currentDate);
  };

  const showMode = (currentMode) => {
    setShow(true);
    setMode(currentMode);
};
//Altera o modo de exibição para DatePicker
const showDatepicker = () => {
    showMode('date');
};
//Altera o modo de exibição para TimePicker
const showTimepicker = () => {
    showMode('time');
};

const formatData = () => {
  let dia = birthDate.getDate();
  let mes = birthDate.getMonth();
  let ano = birthDate.getFullYear();

  if (dia.toString().length === 1) {
      dia = '0' + dia
  }
  if (mes.toString().length === 1) {
      mes = '0' + (mes + 1)
  }
  return dia + '/' + mes + '/' + ano
}

const formatTime = () => {
  let hora = birthDate.getHours()
  let minutos = birthDate.getMinutes()

  if (hora.toString().length === 1) {
      hora = '0' + hora
  }
  if (minutos.toString().length === 1) {
      minutos = '0' + minutos
  }
  return hora + ':' + minutos
}



  useEffect(() => {
    setError("")
  }, [])





  if (!userToken) {
    return (
      <View style={tw`flex-1 bg-white`}>
        <View style={tw`flex w-full h-20`}>
          <Text style={tw`pt-10 text-3xl font-bold text-black text-center mb-2`}>Cadastro</Text>
        </View>
        {!!error && <Text style={tw`flex w-85 mt-6 text-center text-base font-semibold border rounded-lg p-1 self-center`}>{error}</Text>}

        <View style={tw`flex w-full h-7/12 items-center justify-start px-3 pt-5 `}>
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

          <Text style={tw`w-full pl-4 font-semibold text-base mt-4`}>Data de Aniversário</Text>

          <TouchableOpacity style={tw`bg-red-600 w-full justify-center items-center mt-2  rounded-lg shadow-lg`} onPress={showDatepicker} >
          <Text style={tw`text-white py-3 px-33 font-semibold`}>{formatData()}</Text>
      </TouchableOpacity>

          {show && (<DateTimePicker
            minimumDate={new Date("January 1, 1950")}
            maximumDate={new Date()}

            testID="dateTimePicker"
            value={birthDate}
            mode={mode}
            is24Hour={true}
            display="default"
            onChange={onChange}
          />)}

        </View>
        <View style={tw` w-full h-3/12 justify-start`}>
          <View
            style={tw`flex w-10/12 h-11 bg-red-600 justify-center items-center rounded-lg self-center shadow-lg`}
            onStartShouldSetResponder={() => {
              register(email, password, confirmPass, birthDate)
            }}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color="#FFF" />
            ) : (
              <Text style={tw`text-white font-semibold`} >Cadastrar</Text>
            )}

          </View>
        </View>
      </View>
    )
  }
}

export default SignUp