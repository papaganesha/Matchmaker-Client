import { View, Text, Button, ScrollView, StyleSheet, Dimensions, Image, Animated, PanResponder, SafeAreaView, ImageBackground } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import tw from 'twrnc';
import axios from 'axios'

import TinderCard from 'react-tinder-card'

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





const Home = () => {
  const navigation = useNavigation()
  const { logout, userInfo, userToken, refreshUserInfo } = useContext(AuthContext)
  const [firstLogin, setFirstLogin] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    refreshUserInfo()
  }, [])

  //userInfo.firstLogin

  return (
    <View style={tw`flex-1 w-full h-full justify-end`}>
      <Tab.Navigator screenOptions={{ headerShown: false }}>
        <Tab.Screen
          name="Home"
          component={SwipableCards}
          options={{
            tabBarLabel: 'Home',
            tabBarIcon: ({ focused }) => (
              <Icon name="heart" color={focused ? "pink" : "red"} size={18} />
            ),
          }}
        />
        <Tab.Screen
          name="Matchs"
          component={Matchs}
          options={{
            tabBarLabel: 'Matchs',
            tabBarIcon: ({ focused }) => (
              <EntypoIcon name="chat" color={focused ? "pink" : "red"} size={18} />
            ),
          }}
        />
        <Tab.Screen
          name="Settings"
          component={Profile}
          options={{
            tabBarLabel: 'Perfil',
            tabBarIcon: ({ focused }) => (
              <Icon name="user" color={focused ? "pink" : "red"} size={18} />
            ),
          }}
        />
      </Tab.Navigator>
    </View>
  )

}

export default Home

const HomeScreenP = () => {
  const { userInfo, userToken } = useContext(AuthContext)
  const [usersInfo, setUsersInfo] = useState([])

  const getUsers = async () => {
    axios.get(`${BASE_URL}users`, {
      headers: {
        'Authorization': `${userToken}`
      }
    }).then(res => {
      setUsersInfo(res.data.data)
    })
      .catch(err => {
        console.log("GET USERS ERROR: ", err)
      })
  }


  useEffect(() => {
    getUsers()
  }, [])

  const onSwipe = (direction) => {
    console.log('You swiped: ' + direction)
  }

  const onCardLeftScreen = (myIdentifier) => {
    console.log(myIdentifier + ' left the screen')
  }

  if (!usersInfo) {
    return (<View>
      <Text>Acabaram os cards</Text>
    </View>)
  } else {
    return (
      <View style={tw`flex-1 justify-center items-center`}>
        {usersInfo.map(user => {
          return (
            <TinderCard flickOnSwipe="true" onSwipe={onSwipe} onCardLeftScreen={() => onCardLeftScreen('fooBar')} preventSwipe={['right', 'left']}>
              <View style={tw`flex width-full border h-15`}>
                <Text style={tw`text-center`}>{user.fName}</Text>
              </View>
            </TinderCard>
          )
        })}
      </View>)
  }

}

function getAge(dateString) {
  var today = new Date();
  var birthDate = new Date(dateString);
  var age = today.getFullYear() - birthDate.getFullYear();
  var m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
}

function SwipableCards() {

  const [lastDirection, setLastDirection] = useState()
  const { userInfo, userToken } = useContext(AuthContext)
  const [usersInfo, setUsersInfo] = useState([])

  const getUsers = async () => {
    axios.get(`${BASE_URL}users`, {
      headers: {
        'Authorization': `${userToken}`
      }
    }).then(res => {
      setUsersInfo(res.data.data)
    })
      .catch(err => {
        console.log("GET USERS ERROR: ", err)
      })
  }

  useEffect(() => {
    getUsers()
  }, [])

  const swiped = (direction, user) => {
    if (direction == "right") {
      console.log('you liked: ', user.fName, user._id)
    } else {
      console.log('you disliked: ', user.fName, user._id)
    }
    //let userRemoved = usersInfo.filter(function(el){return el._id !== user._id});

    //setUsersInfo(userRemoved)
    setLastDirection(direction)
  }

  const outOfFrame = (name) => {
    console.log(name + ' left the screen!')
  }


  return (
    <View style={styles.container}>
      <View style={styles.cardContainer}>
        {usersInfo ? (
          usersInfo.map((user) =>
            <TinderCard key={user._id} onSwipe={(dir) => swiped(dir, user)} onCardLeftScreen={() => outOfFrame(`${user.fName} ${user.sName}`)}>
              <View style={styles.card}>
                <ImageBackground style={styles.cardImage} source={user.mainPicture ? { uri: user.mainPicture } : require("../assets/placeholder1.jpg")}>
                  <Text style={styles.cardTitle}>{`${user.fName} ${user.sName}, ${getAge(user.birthDate)}`}</Text>
                </ImageBackground>
              </View>
            </TinderCard>
          )
        ) : (
          <View><Text>Acabaram os cards</Text></View>
        )}
      </View>
      {lastDirection ? <Text style={styles.infoText}>You swiped {lastDirection} </Text> : <Text style={styles.infoText} />}
    </View>
  )
}

const HomeScreen = () => {
  const [noMoreCard, setNoMoreCard] = useState(false);
  const [sampleCardArray, setSampleCardArray] = useState(DEMO_CONTENT);
  const [swipeDirection, setSwipeDirection] = useState('--');

  const placeholder = require('../assets/placeholder1.jpg')
  const { logout, userToken, userInfo, refreshUserInfo } = useContext(AuthContext)
  const [usersInfo, setUsersInfo] = useState([])

  const removeCard = (id) => {
    // alert(id);
    usersInfo.splice(
      usersInfo.findIndex((item) => item.id == id),
      1
    );
    setSampleCardArray(usersInfo);
    if (usersInfo.length == 0) {
      setNoMoreCard(true);
    }
  };

  const lastSwipedDirection = (swipeDirection) => {
    setSwipeDirection(swipeDirection);
  };


  const getUsers = async () => {
    axios.get(`${BASE_URL}users`, {
      headers: {
        'Authorization': `${userToken}`
      }
    }).then(res => {
      setUsersInfo(res.data.data)
    })
      .catch(err => {
        console.log("GET USERS ERROR: ", err)
      })
  }


  useEffect(() => {
    getUsers()
  }, [])

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={tw`flex-1 items-center`}>
        {usersInfo.map((item, key) => (
          <SwipeableCard
            key={item._id}
            item={item}
            removeCard={() => removeCard(item._id)}
            swipedDirection={lastSwipedDirection}
          />
        ))}
        {noMoreCard ? (
          <Text style={{ fontSize: 22, color: '#000' }}>No Cards Found.</Text>
        ) : null}
      </View>
    </SafeAreaView>
  );
}


// <View style={tw`flex justify-center items-center`}>
//   <Text style={tw`p-4 my-5`}>{`Bem-vindo ${userInfo.fName}`}</Text>
//   <Button
//     title="Logout"
//     style={tw`w-full bg-red-500 p-4 mt-5`}
//     onPress={() => { logout() }}>
//   </Button>
// </View>

//<ScrollView horizontal="true" contentContainerStyle={tw`flex w-full border h-auto`}>
{/*{usersInfo !== [] && (
//   usersInfo.map(elem => {
//     return (
//       <View key={elem._id} style={tw`flex w-full border`}>
//         <Text>{elem.fName}</Text>
            <Image source={placeholder}
//       </View>
//     )
//   })
// )}*/}
//</ScrollView>


const SCREEN_WIDTH = Dimensions.get('window').width;

const SwipeableCard = ({ item, removeCard, swipedDirection }) => {
  const placeholder = require('../assets/placeholder1.jpg')

  // let xPosition = new Animated.Value(0);
  const [xPosition, setXPosition] = useState(new Animated.Value(0));
  let swipeDirection = '';
  let cardOpacity = new Animated.Value(1);
  let rotateCard = xPosition.interpolate({
    inputRange: [-200, 0, 200],
    outputRange: ['-20deg', '0deg', '20deg'],
  });

  let panResponder = PanResponder.create({
    onStartShouldSetPanResponder: (evt, gestureState) => false,
    onMoveShouldSetPanResponder: (evt, gestureState) => true,
    onStartShouldSetPanResponderCapture: (evt, gestureState) => false,
    onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,
    onPanResponderMove: (evt, gestureState) => {
      xPosition.setValue(gestureState.dx);
      if (gestureState.dx > SCREEN_WIDTH - 250) {
        swipeDirection = 'Right';
      } else if (gestureState.dx < -SCREEN_WIDTH + 250) {
        swipeDirection = 'Left';
      }
    },
    onPanResponderRelease: (evt, gestureState) => {
      if (
        gestureState.dx < SCREEN_WIDTH - 150 &&
        gestureState.dx > -SCREEN_WIDTH + 150
      ) {
        swipedDirection('--');
        Animated.spring(xPosition, {
          toValue: 0,
          speed: 5,
          bounciness: 10,
          useNativeDriver: false,
        }).start();
      } else if (gestureState.dx > SCREEN_WIDTH - 150) {
        Animated.parallel([
          Animated.timing(xPosition, {
            toValue: SCREEN_WIDTH,
            duration: 200,
            useNativeDriver: false,
          }),
          Animated.timing(cardOpacity, {
            toValue: 0,
            duration: 200,
            useNativeDriver: false,
          }),
        ]).start(() => {
          swipedDirection(swipeDirection);
          removeCard();
        });
      } else if (gestureState.dx < -SCREEN_WIDTH + 150) {
        Animated.parallel([
          Animated.timing(xPosition, {
            toValue: -SCREEN_WIDTH,
            duration: 200,
            useNativeDriver: false,
          }),
          Animated.timing(cardOpacity, {
            toValue: 0,
            duration: 200,
            useNativeDriver: false,
          }),
        ]).start(() => {
          swipedDirection(swipeDirection);
          removeCard();
        });
      }
    },
  });

  return (
    <Animated.View
      {...panResponder.panHandlers}
      style={[
        tw`w-full h-5/6 items-center absolute px-3 pt-14`,
        {
          backgroundColor: item.backgroundColor,
          opacity: cardOpacity,
          transform: [{ translateX: xPosition }, { rotate: rotateCard }],
        },
      ]}>

      {/*<Image
        style={tw`flex w-full h-full rounded-3xl`}
        source={placeholder}
      />
      <Text>{item.fName}</Text>*/}

      <ImageBackground source={placeholder} style={tw`flex-1 w-full h-full `}>
        <View style={tw`justify-end items-center h-full`}>
          <Text style={tw``}>{item.fName}</Text>
        </View>
      </ImageBackground>


    </Animated.View>
  );
};


// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     alignItems: 'center',
//   },
//   titleText: {
//     fontSize: 22,
//     fontWeight: 'bold',
//     textAlign: 'center',
//     paddingVertical: 20,
//   },
//   cardStyle: {
//     width: '90%',
//     height: '75%',
//     alignItems: 'center',
//     position: 'absolute',
//     borderRadius: 10,
//   },
//   cardTitleStyle: {
//     color: '#fff',
//     fontSize: 24,
//   },
//   swipeText: {
//     fontSize: 18,
//     textAlign: 'center',
//   },
// });

const DEMO_CONTENT = [
  {
    id: '1',
    cardTitle: 'Card 1',
    backgroundColor: '#FFC107',
  },
  {
    id: '2',
    cardTitle: 'Card 2',
    backgroundColor: '#ED2525',
  },
  {
    id: '3',
    cardTitle: 'Card 3',
    backgroundColor: '#E7088E',
  },
  {
    id: '4',
    cardTitle: 'Card 4',
    backgroundColor: '#00BCD4',
  },
  {
    id: '5',
    cardTitle: 'Card 5',
    backgroundColor: '#FFFB14',
  },
].reverse();


const styles = {
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
  },
  header: {
    color: '#000',
    fontSize: 30,
    marginBottom: 30,
  },
  cardContainer: {
    width: '100%',
    maxWidth: 350,
    height: 500,
    borderWidth: 1,
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
    borderWidth: 1,
    resizeMode: 'cover',
  },
  cardImage: {
    width: '100%',
    height: '100%',
    overflow: 'hidden',
    borderRadius: 20,
  },
  cardTitle: {
    position: 'absolute',
    bottom: 0,
    margin: 10,
    color: 'white',
  },
  infoText: {
    height: 28,
    justifyContent: 'center',
    display: 'flex',
    zIndex: -100,
  }
}
