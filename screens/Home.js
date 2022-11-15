import { View, Text, Button, ScrollView, StyleSheet, Dimensions, Image, ImageBackground } from 'react-native'
import { TouchableOpacity } from "react-native-gesture-handler"
import React, { useContext, useEffect, useState } from 'react'
import tw from 'twrnc';
import axios from 'axios'
import { CometChat } from '@cometchat-pro/react-native-chat';



import Icon from 'react-native-vector-icons/FontAwesome';
import EntypoIcon from 'react-native-vector-icons/Entypo';

import Profile from './Profile'
import Matchs from './Matchs';


import { BASE_URL } from '../config'

import { AuthContext } from '../context/AuthContext';

import { useNavigation } from '@react-navigation/native'

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

const Tab = createBottomTabNavigator();

const SCREEN_HEIGHT = Dimensions.get('window').height

//import SwipableCards from './SwipableCards'

import Card from '../components/Card';

import SwipableCards from './SwipableCards';

import Footer from '../components/Footer';




const Home = () => {
  const navigation = useNavigation()
  const { logout, userInfo, userToken, refreshUserInfo } = useContext(AuthContext)
  const [firstLogin, setFirstLogin] = useState(null)
  const [isLoading, setIsLoading] = useState(false)


  const initializeCometchat = () => {
    //VARIAVEIS AMBIENTE DA APLICAÇÃO
    const appID = '22363314d6b05de2';
    const region = 'us';
    const authKey = 'cefa05028acbf59fc97a08e61ad0f14765251514';

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
          console.log("Text message received: ",textMessage)
        },
        onMediaMessageReceived: mediaMessage => {
          console.log("Media message received: ",mediaMessage)
        },
        onCustomMessageReceived: customMessage => {
          console.log("Custom message received: ",customMessage)
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
    initializeCometchat()
    refreshUserInfo()
  }, [])



  return (
    <View style={tw`flex-1 w-full h-full justify-center`}>
      <Tab.Navigator screenOptions={{ headerShown: false, tabBarStyle: tw`h-16 justify-center pt-3`}}>
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




function Homes() {
  return (
    <View style={styles.container}>
    <SwipableCards/>

    </View>
  )
}



// <View style={styles.cardContainer}>

// {usersInfo ? (
//   usersInfo.map((user) => {
//     return (
//       <View key={user._id}>
//         <TinderCard key={user._id} onSwipe={(dir) => swiped(dir, user)} onCardLeftScreen={() => outOfFrame(`${user.fName} ${user.sName}`)} flickOnSwipe={true} preventSwipe={["up, down"]}>
//           <View style={styles.card} >
//             <TouchableOpacity style={tw`w-full h-full`} onPress={() => { navigation.navigate("ProfileUserOnScreen", {user:user}) }}>

//               <ImageBackground style={[tw`justify-end`, styles.cardImage]} source={user.mainPicture ? { uri: user.mainPicture } : require("../assets/placeholder1.jpg")}>

//                 <View style={tw`w-full h-1/6 flex-row justify-center bg-black rounded bg-opacity-40`}>
//                   <View style={tw`flex w-3/4 justify-center`}>
//                     <Text style={tw`w-full text-white ml-5 text-2xl font-semibold`}>{`${user.fName} ${user.sName}, ${returnAge(user.birthDate)}`} </Text>
//                     <Text style={tw`w-full text-white ml-5`}>{`${returnGender(user.gender)} ${returnOrientation(user.sexOrientation)}`} </Text>
//                   </View>
//                   <View style={tw`w-1/4  justify-center items-end`}
//                     onStartShouldSetResponder={() => {
//                       console.log("click")
//                     }}
//                   >
//                     <TouchableOpacity style={tw` p-4`} onPress={() => { navigation.navigate("ProfileUserOnScreen", {user:user}) }}>
//                       <Icon style={tw`mr-2`} name="info-circle" size={25} color={"white"} />
//                     </TouchableOpacity>
//                   </View>

//                 </View>

//               </ImageBackground>
//             </TouchableOpacity>

//           </View>
//         </TinderCard>

//       </View>
//     )
//   })
// ) : (
//   <View><Text>Acabaram os cards</Text></View>
// )}
// </View>



// <View style={tw`w-full border flex-row justify-center flex-wrap h-25 pt-3`}>
// <TouchableOpacity style={tw`w-1/4 h-25 border justify-center items-center rounded-full mr-6`} onPress={() => {
//   swiped("left", userOnScreen)
// }}>
//   <Icon name="close" style={tw``} size={30} color="black" />
// </TouchableOpacity>
// <TouchableOpacity style={tw`w-1/4 border justify-center items-center rounded-full ml-6`} onPress={() => {
//   swiped("right", userOnScreen)
// }}>
//   <Icon name="heart" style={tw``} size={30} color="black" />
// </TouchableOpacity>
// </View>



const styles = {
  container: {
    display: 'flex',
    alignItems: 'center',
    paddingTop: 65,
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
    height: 600,
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
