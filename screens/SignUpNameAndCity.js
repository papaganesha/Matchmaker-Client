import React, { Component, useState, useContext, useEffect } from 'react';
import { Image, TextInput, Text, View, StyleSheet, TouchableHighlight, ActivityIndicator } from 'react-native';
import axios from 'axios'
import tw from 'twrnc';
import Icon from 'react-native-vector-icons/FontAwesome'
import { AuthContext } from '../context/AuthContext';

import SelectDropdown from 'react-native-select-dropdown'

import { BASE_URL } from '../config';


const TextField = ({ label, ...inputProps }) => {
  const [focused, setFocused] = useState(false);

  return (
    <View style={tw`w-full justify-center items-center mt-4`}>
      <Text style={tw`w-full pl-4 font-semibold text-base`}>{label}</Text>
      <TextInput style={tw`my-1 mb-2 border w-11/12 py-2 rounded bg-white px-2`}
        {...inputProps}
        onFocus={(e) => setFocused(true)}
        onBlur={(e) => setFocused(false)}
      />
    </View>
  )
}

const capitals = ["Porto Alegre", "Florianópolis", "Rio de Janeiro", "São Paulo", "Paraná", "Curitiba"]


const SignUpNameAndCity = ({ navigation }) => {

  const [fName, setFname] = useState("")
  const [sName, setSname] = useState("")
  const [city, setCity] = useState("")
  const [summary, setSummary] = useState("")

  const { userToken, userInfo } = useContext(AuthContext)
  const [option, setOption] = useState(null);
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")



  const updateProfileDetails = async () => {
    setLoading(true)

    if (fName && sName && city && summary) {

      axios.put(`${BASE_URL}user`, {
        fName,
        sName,
        city,
        summary
      }, {
        headers: {
          'Authorization': `${userToken}`
        }
      }).then(res => {
        if (res.data.success) {
          navigation.navigate("SignUpGender")
        }
      })
        .catch(err => {
          console.log("UPDATE USER PROFILE ERROR: ", err.response.data.error)
          setError(err.response.data.error)
        })

    } else {
      console.log("drip")
      setError("Preencha todos os campos")

    }
    setLoading(false)
  }

  useEffect(() => {
    setError("")
  }, [])

  return (
    <View style={tw`flex-1 w-full bg-white`}>
      <View style={tw`flex w-full h-35 justify-end `}>
        <Text style={tw`text-3xl font-bold ml-7`}>Detalhes do Perfil</Text>
      </View>

      {!!error && <Text style={tw`flex w-85 mt-8 text-center text-base font-semibold border rounded p-1 self-center`}>{error}</Text>}

      <View style={tw`flex w-full h-50 mt-6 px-3`}>
        <TextField
          value={fName}
          label={'Nome'}
          onChangeText={text => {
            setFname(text)
          }}
        />
        <TextField
          value={sName}
          label={'Sobrenome'}
          onChangeText={text => {
            setSname(text)
          }}
        />
      </View>

      <View style={tw`flex w-11/12 h-auto px-3 justify-center self-center mt-4 mb-2`}>
        <SelectDropdown
          buttonStyle={tw`flex w-full border rounded-lg `}
          defaultButtonText="Selecione sua cidade"

          data={capitals}
          onSelect={(selectedItem, index) => {
            console.log(selectedItem, index)
            setCity(selectedItem)
          }}
          buttonTextAfterSelection={(selectedItem, index) => {
            // text represented after item is selected
            // if data array is an array of objects then return selectedItem.property to render after item is selected
            return selectedItem
          }}
          rowTextForSelection={(item, index) => {
            // text represented for each item in dropdown
            // if data array is an array of objects then return item.property to represent item in dropdown
            return item
          }}
        />
      </View>

      <View style={tw`flex w-full h-30 px-3 `}>
      <TextField
      multiline={true}
      value={summary}
      label={'Resumo pessoal'}
      onChangeText={text => {
        setSummary(text)
      }}
    />
      </View>

      <View
      style={tw`flex w-10/12 h-11 bg-red-600 justify-center items-center rounded-xl mt-10 self-center`}
      onStartShouldSetResponder={() => {
          updateProfileDetails()
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
          navigation.navigate("SignUpGender")
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


export default SignUpNameAndCity



// <View style={tw`flex w-full h-1/6 border`}>




