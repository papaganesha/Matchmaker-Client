import React, { useState, useContext, useEffect } from 'react';
import { Text, View, StyleSheet, ActivityIndicator } from 'react-native';
import RadioButton from '../components/RadioButton';
import axios from 'axios'
import tw from 'twrnc';
import { AuthContext } from '../context/AuthContext';
import { useNavigation } from '@react-navigation/native';

import { BASE_URL } from '../config';



const SignUpOrientation = () => {
  const navigation = useNavigation()
  const { userToken, userInfo, error, setError } = useContext(AuthContext)
  const [option, setOption] = useState(null);
  const [loading, setLoading] = useState(false)

  const data = [
    { key: 0, value: 'Heterosexual' },
    { key: 1, value: 'Bisexual' },
    { key: 2, value: 'Homosexual' },
  ]

  const updateOrientation = async () => {
    setLoading(true)
    console.log(option)
    let orientation
    if (option) {
      if (option == "Heterosexual") {
        orientation = 0
      }
      if (option == "Bisexual") {
        orientation = 1
      }
      if (option == "Homosexual") {
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
        if (res.data.success) {
          navigation.navigate("SignUpPics")
        }
        //
      })
        .catch(err => {
          console.log("UPDATE USER GENDER ERROR: ", JSON.stringify(err.response.data.error))
          setError(err.response.data.error)
        })
    } else {
      setError("Escolha uma orientação")
    }
    setLoading(false)

  }

  useEffect(() => {
    setError("")
  }, [])

  return (
    <View style={tw`flex-1 w-full bg-white items-center`}>
      <View style={tw`flex w-full h-38 items-start justify-end px-4 mb-4`}>
        <Text style={tw`text-3xl font-bold ml-2`}>Sua orientação</Text>
      </View>

      {!!error && <Text style={tw`flex w-85 mt-5 text-center text-base font-semibold border rounded p-1 self-center`}>{error}</Text>}


      <View style={tw`flex w-full h-85 justify-start pt-10`}>
        <RadioButton key={data.key} data={data} onSelect={(value) => setOption(value)} />
      </View>

      <View
        style={tw`flex w-10/12 h-11 bg-red-600 justify-center items-center rounded-lg self-center shadow-lg`}
        onStartShouldSetResponder={() => {
          updateOrientation()
        }}
      >
        {loading ? (
          <Text style={tw``}><ActivityIndicator size="small" color="#FFF" /></Text>
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


export default SignUpOrientation