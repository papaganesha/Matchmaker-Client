import React, { useState, useContext } from 'react';
import { Text, View, StyleSheet, TouchableHighlight, ActivityIndicator } from 'react-native';
import RadioButton from '../components/RadioButton';
import axios from 'axios'
import tw from 'twrnc';
import Icon from 'react-native-vector-icons/FontAwesome'
import { AuthContext } from '../context/AuthContext';
import { useNavigation } from '@react-navigation/native';

import { BASE_URL } from '../config';



const SignUpOrientation = () => {
  const navigation = useNavigation()
  const { userToken, userInfo } = useContext(AuthContext)
  const [option, setOption] = useState(null);
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const data = [
    { key: 0, value: 'Heterossexual' },
    { key: 1, value: 'Bissexual' },
    { key: 2, value: 'Homossexual' },
  ]

  const updateOrientation = async () => {
    setLoading(true)
    console.log(option)
    let orientation
    if (option) {
      if (option == "Heterossexual") {
        orientation = 0
      }
      if (option == "Bissexual") {
        orientation = 1
      }
      if (option == "Homossexual") {
        orientation = 2
      }
      console.log(orientation)

      axios.put(`${BASE_URL}user`, {
        sexOrientation: orientation
      }, {
        headers: {
          'Authorization': `${userToken}`
        }
      }).then(res => {
        console.log("SUCCESS >", res.data)
        if (res.data.success) {
          navigation.navigate("SignUpPics")
        }
        //
      })
        .catch(err => {
          console.log("UPDATE USER GENDER ERROR: ", JSON.stringify(err.response.data.data))
          setError("err.response.data.data")
        })
    } else {
      setError("Escolha uma orientação")
    }
    setLoading(false)

  }



  return (
    <View style={tw`flex-1 w-full bg-white`}>
      <View style={tw`flex w-full h-38 items-start justify-end px-4`}>
        <Text style={tw`text-3xl font-bold ml-4`}>Sua orientação</Text>
      </View>

      {!!error && <Text style={tw`flex w-85 mt-10 text-center text-base text-white font-semibold bg-gray-500 rounded p-1 self-center`}>{error}</Text>}


      <View style={tw`flex w-full h-5/12 justify-center `}>
        <RadioButton key={data.key} data={data} onSelect={(value) => setOption(value)} />
      </View>

      <View
        style={tw`flex w-10/12 h-11 bg-red-600 justify-center items-center rounded-xl self-center mt-5`}
        onStartShouldSetResponder={() => {
          updateOrientation()
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
          navigation.navigate("SignUpPics")
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


export default SignUpOrientation