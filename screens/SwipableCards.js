import React, { useState, useMemo, useEffect, useContext } from 'react'
import { ImageBackground, Text, View, Button, ActivityIndicator } from 'react-native'
import { TouchableOpacity } from "react-native-gesture-handler"
import Footer from "../components/Footer"
import Icon from 'react-native-vector-icons/FontAwesome';
import EntypoIcon from 'react-native-vector-icons/Entypo';

import TinderCard from 'react-tinder-card'
import tw from 'twrnc';
import axios from 'axios'

import { BASE_URL } from '../config'

import { AuthContext } from '../context/AuthContext';

import { useNavigation } from '@react-navigation/native'

const styles = {
  container: {
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
  header: {
    color: '#000',
    fontSize: 30,
  },
  cardContainer: {
    width: '100%',
    maxWidth: 330,
    height: 505,
  },
  card: {
    position: 'absolute',
    backgroundColor: '#fff',
    width: '100%',
    maxWidth: 330,
    height: 505,
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


function returnAge(dateString) {
  var today = new Date();
  var birthDate = new Date(dateString);
  var age = today.getFullYear() - birthDate.getFullYear();
  var m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
}


const alreadyRemoved = []

const Advanced = () => {
  const navigation = useNavigation()
  const { userInfo, userToken } = useContext(AuthContext)
  const [loading, setLoading] = useState(true)
  const [usersInfo, setUsersInfo] = useState([])


  const getUsersInfo = async () => {

    const res = await axios.get(`${BASE_URL}users`, {
      headers: {
        'Authorization': `${userToken}`
      }
    })
    const json = await res.data.data
    setLoading(false)
    return json
  }

  useEffect(() => {
    getUsersInfo().then(result => {
      setUsersInfo(result)
    })
  }, [])



  const addLike = (user) => {
    //RETORNO SUCCESS TRUE, ISMATCH FALSE(APENAS ADICIONOU O LIKE)
    //RETORNO SUCCESS TRUE, ISMATCH TRUE(MATCH REGISTRADO), MOSTRAR ANIMAÇÃO DE MATCH
    axios.post(`${BASE_URL}like`, {
      matchId: user._id
    }, {
      headers: {
        'Authorization': `${userToken}`
      }
    }).then(res => {
      if (res.data.success) {
        console.log(`LIKE ADDEDD: MATCHID ${user._id}`, res.data)
        if (res.data.isMatch) {
          console.log(`ITS A MATCH: MATCHID ${user._id} YOUR_ID ${userInfo._id}`)
          navigation.navigate("MatchAnimation", { userInfo: userInfo, matchInfo: user })
        }
      }
    })
      .catch(err => {
        console.log("ERROR ADD LIKE: ", err)
      })

  }


  const swiped = (direction, user) => {
    //console.log('removing: ' + nameToDelete + ' to the ' + direction)
    if (direction === 'right') {
      console.log(`LIKED: ${user.fName} ${user.sName} to the ${direction}`)
      addLike(user)
    }
    if (direction === 'left') {
      console.log(`DISLIKED: ${user.fName} ${user.sName} to the ${direction}`)
    }
  }


  const outOfFrame = (name) => {
    alreadyRemoved.push(name)
    console.log(name + ' left the screen!')
    setUsersInfo((current) =>
    current.filter((user) => user.fName != name)
    );

    console.log(alreadyRemoved)
  }



  const returnGender = (gender) => {
    let returnG = ""
    if (gender == 0) {
      returnG = "Homem"
    }
    if (gender == 1) {
      returnG = "Mulher"
    }
    if (gender == 2) {
      returnG = "Transexual Homem"
    }
    if (gender == 3) {
      returnG = "Transexual Mulher"
    }
    return returnG
  }

  const returnOrientation = (sexOrientation) => {
    let returnO = ""

    if (sexOrientation == 0) {
      returnO = "Heterosexual"
    }
    if (sexOrientation == 1) {
      returnO = "Bisexual"
    }
    if (sexOrientation == 2) {
      returnO = "Homosexual"
    }

    return returnO
  }

  if (loading) {
    return (
      <View style={tw`flex-1 items-center justify-center`}>
        <ActivityIndicator size={30} color="black" />
      </View>
    )
  } else {
    return (
      <View style={styles.container}>
        <View style={styles.cardContainer}>
          {usersInfo.length > 0 ? (
            usersInfo.map((user) =>
              <TinderCard key={user._id} onSwipe={(dir) => swiped(dir, user)} onCardLeftScreen={() => outOfFrame(user.fName)}>
                <View style={[styles.card, tw` rounded-lg shadow-xl`]}>
                  <TouchableOpacity className="pressable" style={tw`w-full h-full`} onPress={() => { navigation.navigate("ProfileUserOnScreen", { user: user }) }}>

                    <ImageBackground imageStyle={tw`rounded-lg `} style={[tw`justify-end w-full h-full`]} source={user.mainPicture ? { uri: user.mainPicture } : require("../assets/placeholder1.jpg")}>

                      <View style={tw`w-full h-1/6 flex-row justify-center bg-black  bg-opacity-40 border-b-1 rounded-lg`}>
                        <View style={tw`flex w-3/4 justify-center`}>
                          <Text style={tw`w-full text-white ml-5 text-2xl font-bold`}>{`${user.fName} ${user.sName}, ${returnAge(user.birthDate)}`} </Text>
                          <Text style={tw`w-full text-base text-white ml-5`}>{`${returnGender(user.gender)} ${returnOrientation(user.sexOrientation)}`} </Text>
                        </View>
                        <View style={tw`w-1/4  justify-center items-end`}>
                          <TouchableOpacity style={tw` p-4`} onPress={() => { navigation.navigate("ProfileUserOnScreen", { user: user }) }}>
                            <Icon style={tw`mr-2`} name="info-circle" size={25} color={"white"} />
                          </TouchableOpacity>
                        </View>

                      </View>

                    </ImageBackground>
                  </TouchableOpacity>
                </View>
              </TinderCard>
            )
          ) : (
            <View style={tw`flex-1 w-full justify-center items-center mt-22`}>
              <Text style={tw`text-3xl text-black font-semibold`}>Acabaram os cards</Text>
            </View>
          )}
        </View>
      </View>
    )
  }
}

export default Advanced