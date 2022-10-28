import { View, RadioButton, Text, Image, FlatList, SafeAreaView, StatusBar, ActivityIndicator, StyleSheet, TouchableOpacity } from 'react-native'
import React, { useContext, useState, useEffect } from 'react'
import { AuthContext } from '../context/AuthContext'
import tw from 'twrnc';
import { useNavigation, NavigationActions, StackActions } from '@react-navigation/native';
import axios from 'axios'
import { BASE_URL } from '../config'
import Icon from 'react-native-vector-icons/FontAwesome'


const interestsList = [
  { id: 1, iconName: "bicycle", interestName: "Ciclismo" },
  { id: 2, iconName: "soccer-ball-o", interestName: "Futebol" },
  { id: 3, iconName: "dribbble", interestName: "Basquete" },
  { id: 4, iconName: "heartbeat", interestName: "Exercicios" },
  { id: 5, iconName: "heartbeat", interestName: "Corrida" },
  { id: 6, iconName: "leaf", interestName: "Ar Livre" },
  { id: 7, iconName: "music", interestName: "Musica" },
  { id: 8, iconName: "cutlery", interestName: "Cozinhar" },
  { id: 9, iconName: "grav", interestName: "Adrenalina" },
  { id: 10, iconName: "camera-retro", interestName: "Fotográfia" },
  { id: 11, iconName: "heartbeat", interestName: "Natação" },
  { id: 12, iconName: "music", interestName: "Pagode" },
  { id: 13, iconName: "music", interestName: "Balada" },
  { id: 14, iconName: "user", interestName: "Familia" },
  { id: 15, iconName: "user", interestName: "Amigos" },
  { id: 16, iconName: "plane", interestName: "Viagem" },

]

const Item = ({ item, onPress, backgroundColor, textColor }) => (
  <TouchableOpacity onPress={onPress} style={[tw`flex flex-row w-35 h-10 p-1 my-1 mx-2 border justify-center items-center rounded-lg bg-red-500`, backgroundColor]}>
    <View style={tw`flex justify-center items-center ml-3 mr-3 `}>
      <Icon name={item.iconName} style={tw``} size={20} color={textColor} />
    </View>
    <View style={tw`flex justify-center items-center`}>
      <Text style={[textColor, tw`text-base w-20 `]}>{item.interestName}</Text>
    </View>
  </TouchableOpacity>
);


const SignUpInterests = () => {
  const navigation = useNavigation()
  const { userInfo, userToken, refreshUserInfo } = useContext(AuthContext)
  const [selecteds, setSelecteds] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("")

  // ADICIONA E REMOVE ID DOS INTERESSES
  // 
  const handleSelected = (selected) => {
    //SALVANDO ESTADO ATUAL DO ARRAY
    let prevSelecteds = selecteds

    // VERIFICA SE SELECTED ATUAL NAO ESTA DENTRO DO ARRAY DE SELECIONADOS
    if (selecteds.indexOf(selected) == -1) {
      //ADICIONA ID AOS SELECIONADOS
      setSelecteds([selected, ...selecteds])
    } else {
      //DEVOLVE TUDO QUE NÃO É O ITEM SELECIONADO -- REMOÇÃO
      const reducedArray = prevSelecteds.filter((item) => {
        return item !== selected
      })
      setSelecteds(reducedArray)
    }

  }

  const uploadInterests = () => {
    setLoading(true)

    let toUpload = interestsList.filter((item) => {
      if (selecteds.indexOf(item.id) !== -1) {
        return { interestName: item.interestName, iconName: item.iconName }
      }
    })
    console.log("upload", toUpload)

    if (toUpload.length < 3) {
      setErrorMessage("Escolha no minimo 3 interesses")
    } else {
      axios.post(`${BASE_URL}interests`, {
        interestsArray: toUpload
      }, {
        headers: {
          'Authorization': `${userToken}`
        }
      }).then(res => {
        console.log("SUCCESS >", res.data.success)
        if (res.data.success) {
          console.log("sucesso na inserção de interesses", res.data.message)

          axios.put(`${BASE_URL}user`, {
            firstLogin: false
          }, {
            headers: {
              'Authorization': `${userToken}`
            }
          })
            .then(res => {
              if (res.data.success) {
                console.log("FOI PRA HOME")
                refreshUserInfo()
              }
            })
            .catch(err => {
              console.log("UPDATE USER FIRSTLOGIN SET ERROR: ", JSON.stringify(err.response.data.data))
              setErrorMessage(JSON.stringify(err.response.data.data))
            })

        }
      })
        .catch(err => {
          console.log("UPDATE USER INTERESTS ERROR: ", JSON.stringify(err))
          setErrorMessage(JSON.stringify(err.response.data.data))
        })
    }
    setLoading(false)

  }

  useEffect(() => { }, [selecteds])

  return (
    <View style={tw`flex-1 h-full w-full`}>
      <View style={tw`flex h-1/4 justify-center pt-4`}>
        <Text style={tw`font-bold text-3xl mt-20 ml-10`}>Seus interesses</Text>
        <Text style={tw`font-bold text-sm text-center mt-4 mx-5`} >Selecione alguns de seus interesses e deixe todo mundo saber pelo que você é apaixonado.</Text>
      </View>
      {!!errorMessage && (<View style={tw`flex w-full h-10  items-center justify-center mt-4`}><Text style={tw`flex w-85 text-center text-base font-semibold bg-gray-500 rounded p-1`}>{errorMessage}</Text></View>)}
      <View style={tw`flex flex-row w-full h-3/6 flex-wrap justify-center  mt-8 mb-6`}>


        {interestsList.map(item => {
          //SETA A COR DE FUNDO E DA LETRA DE ACORDO COM O ESTADO, VERIFICA SE ITEM.ID ESTA NOS SELECIONADOS OU NAO
          const backgroundColor = selecteds.indexOf(item.id) !== -1 ? "red" : "white";
          const color = selecteds.indexOf(item.id) !== -1 ? 'white' : 'black';
          return (
            <Item
              item={item}
              onPress={() => handleSelected(item.id)}
              backgroundColor={{ backgroundColor }}
              textColor={{ color }}
            />
          )
        })}
      </View>

      <View style={tw`flex w-full h-full justify-start items-center `}>
        <View
          style={tw`flex w-10/12 h-11 bg-red-600 justify-center items-center rounded-xl `}
          onStartShouldSetResponder={() => {
            uploadInterests()
          }}
        >
          {loading ? (
            <Text style={tw``}><ActivityIndicator size="small" color="#FFF" /></Text>
          ) : (
            <Text style={tw`text-white text-base font-semibold `}>
              Continuar
            </Text>
          )}
        </View>
      </View>
    </View>
  )
}

export default SignUpInterests

