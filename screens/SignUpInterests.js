import { View, Text, ActivityIndicator, TouchableOpacity } from 'react-native'
import React, { useContext, useState, useEffect } from 'react'
import { AuthContext } from '../context/AuthContext'
import tw from 'twrnc';
import { useNavigation} from '@react-navigation/native';
import axios from 'axios'
import { BASE_URL } from '../config'
import Icon from 'react-native-vector-icons/FontAwesome'
import { CometChat } from '@cometchat-pro/react-native-chat';


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
      <Icon name={item.iconName} style={[textColor, tw``]} size={20} color={textColor} />
    </View>
    <View style={tw`flex justify-center items-center`}>
      <Text style={[textColor, tw`text-base w-20 `]}>{item.interestName}</Text>
    </View>
  </TouchableOpacity>
);


const SignUpInterests = ({navigation}) => {
  const { userInfo, userToken, refreshUserInfo, error, setError } = useContext(AuthContext)
  const [selecteds, setSelecteds] = useState([]);
  const [loading, setLoading] = useState(false);


  const initializeCometchat = () => {
    //VARIAVEIS AMBIENTE DA APLICAÇÃO
    const appID = '22640333e5949db3';
    const region = 'us';
    const authKey = '5742c0b19492637494d0242f131b5964f5cba46a';

    //NOME COMPLETO E ID DO USUARIO
    const UID = userInfo._id;
    const name = `${userInfo.fName} ${userInfo.sName}`

    //CRIANDO INSTANCIA DE NOVO USUARIO COM UID
    let newUser = new CometChat.User(UID);
    //SETANDO O NOME DA INSTANCIA DE NOVO USUARIO
    newUser.setName(name);

    //PARAMETROS DE CONFIGURAÇÃO PRÉDEFINIDOS
    const appSetting = new CometChat.AppSettingsBuilder()
      .subscribePresenceForAllUsers()
      .setRegion(region)
      .build()

    //INICIALIZANDO COMETCHAT COM OS PARAMETROS 
    CometChat.init(appID, appSetting).then(
      () => {
        console.log('Initialization completed successfully');
        // You can now call login function.
      },
      (error) => {
        console.log('Initialization failed with error:', error);
        // Check the reason for error and take appropriate action.
      },
    );

    //CRIA NOVO USUARIO COMETCHAT
    CometChat.createUser(newUser, authKey).then(
      //CASO SUCESSO
      user => {
        if (!user) {
          console.log("Usuario Cometchat criado com sucesso")

        }

      }, error => {
        if (error.code == "ERR_UID_ALREADY_EXISTS") {
          console.log(error.code)
        }
      }
    )
  }

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
      setError("Escolha no minimo 3 interesses")
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
                //CRIA USUARIO NO COMETCHAT
                initializeCometchat()
                refreshUserInfo()
                navigation.navigate("Home")
              }
            })
            .catch(err => {
              //console.log("UPDATE USER FIRSTLOGIN SET ERROR: ", JSON.stringify(err.response.data.error))
              console.log("err", err)
              setError(err)
            })

        }
      })
        .catch(err => {
          console.log("UPDATE USER INTERESTS ERROR: ", JSON.stringify(err))
          setError(JSON.stringify(err.response.data.error))
        })
    }
    setLoading(false)

  }

  useEffect(() => { }, [selecteds])

  useEffect(() => {
    setError("")
  }, [])

  return (
    <View style={tw`flex-1 h-full w-full`}>
      <View style={tw`flex h-35 justify-center`}>
        <Text style={tw`font-bold text-3xl pt-4 ml-10`}>Seus interesses</Text>
        <Text style={tw`font-bold text-sm text-center mt-4 mx-5`} >Selecione alguns de seus interesses e deixe todo mundo saber pelo que você é apaixonado.</Text>
      </View>
      
      {!!error && <Text style={tw`flex w-85 mt-5 text-center text-base font-semibold border rounded p-1 self-center`}>{error}</Text>}

      <View style={tw`flex flex-row w-full h-95 flex-wrap justify-center  mt-6 mb-6 `}>
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
          style={tw`flex w-10/12 h-11 bg-red-600 justify-center items-center rounded-lg shadow-lg`}
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


