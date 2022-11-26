import { View, Text } from 'react-native'
import React, { useContext, useEffect } from 'react'
import tw from 'twrnc';
import { CometChat } from '@cometchat-pro/react-native-chat';
import { useIsFocused } from "@react-navigation/core";

import Icon from 'react-native-vector-icons/FontAwesome';
import EntypoIcon from 'react-native-vector-icons/Entypo';

import Profile from './Profile'
import Matchs from './Matchs';

import { AuthContext } from '../context/AuthContext';

import { useNavigation } from '@react-navigation/native'

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

const Tab = createBottomTabNavigator();

import SwipableCards from './SwipableCards';


function Homes() {
  const { userInfo } = useContext(AuthContext)
  return (
    <View style={styles.container}>
    <View style={tw`flex w-full items-center mb-6`}>
    <Text style={tw`text-2xl font-semibold`}>Descubra</Text>
    <Text style={tw`text-sm text-gray-500`}>{userInfo.city}</Text>
    </View>
      <SwipableCards />
    </View>
  )
}


const Home = ({navigation}) => {
  const { userInfo, refreshUserInfo, setError } = useContext(AuthContext)
  const isFocused = useIsFocused();

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
          loginCometchat(UID, authKey)

        }

      }, error => {
        if (error.code == "ERR_UID_ALREADY_EXISTS") {
          loginCometchat(UID, authKey)
        }
      }
    )
  }

  const loginCometchat = (UID, authKey) => {
    CometChat.login(UID, authKey).then(
      user => {
        console.log('Login Successful:', { user })
        createMsgListener()
        // let GUID = "global"
        // let password = ""
        // let groupType = CometChat.GROUP_TYPE.PUBLIC
        // CometChat.joinGroup(GUID, groupType, password).then(
        //   group => {
        //     console.log('Group joined successfully:', group)
        //   }, error => {
        //     console.log('Group joining failed with exception:', error)

        //   }
        // )
      }
      , error => {
        console.log('Login failed with exception:', { error })
        setError(error)
      },
    )
  }

  const logoutCometchat = (UID, authKey) => {
    CometChat.logout().then(
      () => {
        console.log('Logout completed Successfully:', { user })
        removeMsgListener()
      }
      , error => {
        console.log('Logout failed with exception:', { error })
        setError(error)
      },
    )
  }

  const createMsgListener = () => {
    let listenerID = "GLOBAL_LISTENER_ID"

    CometChat.addMessageListener(
      listenerID,
      new CometChat.MessageListener({
        onTextMessageReceived: textMessage => {
          console.log("Text message received: ", textMessage)
          
        },
        onMediaMessageReceived: mediaMessage => {
          console.log("Media message received: ", mediaMessage)
        },
        onCustomMessageReceived: customMessage => {
          console.log("Custom message received: ", customMessage)
        }
      })
    )
  }

  const removeMsgListener = () => {
    let listenerID = "GLOBAL_LISTENER_ID"

    CometChat.removeMessageListener(
      listenerID,)
  }


  useEffect(() => {
    //refreshUserInfo()
    navigation.reset({
      index: 0,
      routes: [{name: 'Home'}],
    });
    initializeCometchat()
    setError("")
  }, [])



  return (
    <View style={tw`flex-1 w-full h-full justify-center`}>
      <Tab.Navigator screenOptions={{ headerShown: false, tabBarStyle: tw`h-16 justify-center pt-3` }}>
        <Tab.Screen
          name="Home"
          component={Homes}
          options={{
            tabBarLabel: '',
            tabBarIcon: ({ focused }) => (
              <Icon name="heart" color={focused ? "pink" : "red"} size={26} />
            ),
          }}
        />
        <Tab.Screen
          name="Matchs"
          component={Matchs}
          options={{
            tabBarLabel: '',
            tabBarIcon: ({ focused }) => (
              <EntypoIcon name="chat" color={focused ? "pink" : "red"} size={26} />
            ),
          }}
        />
        <Tab.Screen
          name="Settings"
          component={Profile}
          options={{
            tabBarLabel: '',
            tabBarIcon: ({ focused }) => (
              <Icon name="user" color={focused ? "pink" : "red"} size={26} />
            ),
          }}
        />
      </Tab.Navigator>
    </View>
  )

}

export default Home


const styles = {
  container: {
    display: 'flex',
    alignItems: 'center',
    paddingTop: 15,
    width: '100%',
    height: '100%',
  },
  header: {
    color: '#000',
    fontSize: 30,
    marginBottom: 10,
  },
  cardContainer: {
    width: '100%',
    maxWidth: 350,
    height: 500,
  },
  card: {
    position: 'absolute',
    backgroundColor: '#fff',
    width: '100%',
    maxWidth: 350,
    height: 500,
    shadowColor: 'black',
    shadowOpacity: 0.2,
    shadowRadius: 20,
    borderRadius: 20,
    resizeMode: 'cover',
  },
  cardImage: {
    width: '100%',
    height: '100%',
    overflow: 'hidden',
    borderRadius: 20,
  },

  infoText: {
    height: 28,
    justifyContent: 'center',
    display: 'flex',
    zIndex: -100,
  }
}
