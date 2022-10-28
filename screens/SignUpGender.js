import React, { useState, useContext } from 'react';
import { Text, View, StyleSheet, TouchableHighlight, ActivityIndicator } from 'react-native';
import RadioButton from '../components/RadioButton';
import axios from 'axios'
import tw from 'twrnc';
import Icon from 'react-native-vector-icons/FontAwesome'
import { AuthContext } from '../context/AuthContext';
import { useNavigation } from '@react-navigation/native';

import { BASE_URL } from '../config';

export default SignUpGender = () => {
  const navigation = useNavigation()
  const { userToken, userInfo } = useContext(AuthContext)
  const [option, setOption] = useState(null);
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)


  const data = [
    { key: 0, value: 'Homem'},
    { key: 1, value: 'Mulher'},
    { key: 2, value: 'Transexual Homem'},
    { key: 3, value: 'Transexual Mulher'},
  ]
  

  const updateGender = async () => {
    setLoading(true)
    console.log(option)
    let gender
    if(option){
      if (option == "Homem") {
        gender = 0
      }
      if (option == "Mulher") {
        gender = 1
      }
      if (option == "Transexual Homem") {
        gender = 2
      }
      if (option == "Transexual Mulher") {
        gender = 3
      }
      console.log(gender)
  
      axios.put(`${BASE_URL}user`, {
        gender
      }, {
        headers: {
          'Authorization': `${userToken}`
        }
      }).then(res => {
        console.log("SUCCESS >",res.data)
        if(res.data.success){
          navigation.navigate("SignUpOrientation")
        }
        //
      })
        .catch(err => {
          console.log("UPDATE USER GENDER ERROR: ", JSON.stringify(err.response.data.data))
          setError(err.response.data.data)
        })
    }else{
      setError("Escolha um genero")
    }
    setLoading(false)

  }



  return (
    <View style={tw`flex-1 w-full bg-white`}>
    <View style={tw`flex w-full h-38 items-start justify-end px-4`}>
    <Text style={tw`text-3xl font-bold ml-4`}>Seu gênero</Text>
      </View>

      {!!error && <Text style={tw`flex w-85 mt-10 text-center text-base text-white font-semibold bg-gray-500 rounded p-1 self-center`}>{error}</Text>}

      <View style={tw`flex w-full h-3/6 justify-start pt-10`}>
        <RadioButton key={data.key} data={data} onSelect={(value) => setOption(value)} />
      </View>

    

        <View
        style={tw`flex w-10/12 h-11 bg-red-600 justify-center items-center rounded-xl self-center`}
        onStartShouldSetResponder={() => {
            updateGender()
          }}
        >
          {loading ? (
            <Text style={tw``}><ActivityIndicator size="small" color="#FFF" /></Text>
          ) : (
            <Text style={tw`text-white text-base`}>
              Continuar
            </Text>
          )}
      </View>

      <View
      style={tw`flex w-10/12 h-11 bg-red-600 justify-center items-center rounded-xl mt-12 self-center`}
      onStartShouldSetResponder={() => {
          navigation.navigate("SignUpOrientation")
        }}
      >
        {loading ? (
          <Text style={tw``}><ActivityIndicator size="small" color="#FFF" /></Text>
        ) : (
          <Text style={tw`text-white text-base`}>
            Skip
          </Text>
        )}
      </View>

    </View>
  )
}

const styles = StyleSheet.create({
  paragraph: {
    margin: 24,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
})

