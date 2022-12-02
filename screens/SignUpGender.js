import React, { useState, useContext, useEffect } from 'react';
import { Text, View, StyleSheet, ActivityIndicator } from 'react-native';
import RadioButton from '../components/RadioButton';
import axios from 'axios'
import tw from 'twrnc';
import { AuthContext } from '../context/AuthContext';
import { useNavigation } from '@react-navigation/native';

import { BASE_URL } from '../config';

export default SignUpGender = () => {
  const navigation = useNavigation()
  const { userToken, error, setError } = useContext(AuthContext)
  const [option, setOption] = useState(null);
  const [loading, setLoading] = useState(false)


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
  
      axios.put(`${BASE_URL}user`, {
        gender
      }, {
        headers: {
          'Authorization': `${userToken}`
        }
      }).then(res => {
        if(res.data.success){
          navigation.navigate("SignUpOrientation")
        }
        //
      })
        .catch(err => {
          setError(err.response.data.error)
        })
    }else{
      setError("Escolha um genêro")
    }
    setLoading(false)

  }

  useEffect(() => {
    setError("")
    setOption(null)
  }, [])

  useEffect(() => {

  }, [loading])

  return (
    <View style={tw`flex-1 w-full bg-white items-center`}>
    <View style={tw`flex w-full h-20 items-start justify-end px-4   `}>
    <Text style={tw`text-3xl font-bold ml-3`}>Seu gênero</Text>
      </View>

      {!!error && <Text style={tw`flex w-86 mt-6 text-center text-base font-semibold border rounded p-1 self-center`}>{error}</Text>}

      <View style={tw`flex w-full h-3/6 justify-center pt-4`}>
        <RadioButton key={data.key} data={data} onSelect={(value) => setOption(value)} />
      </View>


      <View
        style={tw`flex w-85 h-11 bg-red-600 justify-center items-center rounded-lg shadow-lg self-center mt-2`}
        onStartShouldSetResponder={() => {
            updateGender()
          }}
        >
          {loading ? (
            <Text style={tw``}><ActivityIndicator size={15} color="#FFF" /></Text>
          ) : (
            <Text style={tw`text-white text-base font-semibold`}>
              Continuar
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

