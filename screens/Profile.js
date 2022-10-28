import { View, Text, Button, ScrollView, StyleSheet, Dimensions, Image, Animated, PanResponder, SafeAreaView, ImageBackground, ActivityIndicator } from 'react-native'
import React, { Component, useContext, useEffect, useState } from 'react'
import tw from 'twrnc';
import axios from 'axios'

import Icon from 'react-native-vector-icons/FontAwesome'


import { AdvancedImage } from '@cloudinary/react';
import { Cloudinary } from '@cloudinary/url-gen';
import { fill } from "@cloudinary/url-gen/actions/resize";

import { BASE_URL } from '../config'

import { AuthContext } from '../context/AuthContext';
import { useNavigation } from '@react-navigation/native'

import { FlatListSlider } from '@kuasha420/react-native-flatlist-slider';


const ImageSlider = (props) => {
  const { logout, userInfo, userToken, refreshUserInfo } = useContext(AuthContext)

  const images = [
    userInfo.mainPicture,
    ...userInfo.pictures
  ];
  
  return <FlatListSlider
    style={tw`flex w-full h-full justify-center`}
    animated={false}
    showIndicator={false}
    resizeMode='center'
    images={images} />;
};


const Profile = () => {
  const { userInfo, userToken, logout } = useContext(AuthContext)
  const [userAge, setUserAge] = useState(null)
  const [loading, setLoading] = useState(false)

  console.log(userInfo.interests)
  const getUserAge = () => {
    setLoading(true)
    axios.get(`${BASE_URL}user/age`, {
      headers: {
        Authorization: `${userToken}`
      }
    })
      .then(res => {
        setUserAge(res.data.data)
      })
      .catch(err => {
        console.log(err)
      })
    setLoading(false)
  }

  const RenderPictures = () => {
    if (userInfo.mainPicture) {
      const mainPicture = userInfo.mainPicture
      return (<Image style={tw`flex w-10/12 h-10/12 `} source={{ uri: mainPicture }} />)
    }
  }

  const RenderGenderAndOrientation = ({ userInfo }) => {
    let returnG = ""
    let returnO = ""
    if (userInfo.gender == 0) {
      returnG = "Homem"
    }
    if (userInfo.gender == 1) {
      returnG = "Mulher"
    }
    if (userInfo.gender == 2) {
      returnG = "Transsexual"
    }
    if (userInfo.sexOrientation == 0) {
      returnO = "Heterossexual"
    }
    if (userInfo.sexOrientation == 1) {
      returnO = "Bissexual"
    }
    if (userInfo.sexOrientation == 2) {
      returnO = "Homossexual"
    }
    return (<Text style={tw`mt-1 ml-8  font-semibold`}>{returnG}, {returnO}</Text>)
  }


  const RenderCity = () => {
    return (
      <View style={tw`mt-4`}>
        <Text style={tw`mt-2 ml-8 text-lg font-bold`}>Cidade</Text>
        <Text style={tw`mt-2 ml-8  font-semibold`}>{userInfo.city}</Text>
      </View>
    )
  }

  const RenderSummary = ({ summary }) => {
    return (
      <View style={tw`flex w-11/12 h-10/12`}>
        <Text style={tw`mt-3 ml-8 text-lg font-bold`}>Sobre</Text>
        <View style={tw`mt-3 ml-8 font-bold border rounded`}>
          <Text style={tw`mt-3 ml-2 font-bold `}>{summary}</Text>
          <Text style={tw`mt-3 ml-2 font-bold `}></Text>
          <Text style={tw`mt-3 ml-2 font-bold `}></Text>
          <Text style={tw`mt-3 ml-2 font-bold `}></Text>
        </View>
      </View>
    )
  }

  const RenderInterests = ({ interests }) => {
    return (
      <View style={tw`flex w-11/12 h-10/12`}>
        <Text style={tw`mt-3 ml-8 text-lg font-bold`}>Interesses</Text>
        <View style={tw`mt-3 ml-8 font-bold border rounded`}>
          <Text style={tw`mt-3 ml-2 font-bold `}>{interests[0].interestName}</Text>
          <Text style={tw`mt-3 ml-2 font-bold `}>{interests[1].interestName}</Text>
        </View>
      </View>
    )
  }

  useEffect(() => {
    getUserAge()
  }, [])

  return (
    <View style={tw`flex-1 items-end w-full pt-8`}>
      <View
        style={tw`flex w-10 h-10 border justify-center items-center rounded-2xl mt-5 mr-5 `}
        onStartShouldSetResponder={() => {
          logout()
        }}
      >
        <Text style={tw`text-white text-base justify-center items-center`}>
          <Icon name="sign-out" style={tw``} size={15} color="black" />
        </Text>

      </View>

      <View style={tw`flex items-center w-full h-2/4 justify-center  `}>
        <View style={tw`flex w-full justify-start items-center border`}>
          <RenderPictures />
        </View>
      </View>
      
      <View style={tw`flex items-start w-full  `}>
        <Text style={tw` ml-8 text-2xl font-semibold`}>{userInfo.fName} {userInfo.sName}, {loading ? (<ActivityIndicator size={20} color="#FF0D" />) : (userAge)}</Text>
        <RenderGenderAndOrientation userInfo={userInfo} />
        <RenderCity city={userInfo.city} />
        <Text style={tw`mt-3 ml-8  font-semibold`}></Text>
      </View>
      
      <View style={tw`flex w-full border`}>
        <RenderInterests interests={userInfo.interests} />
      </View>

      <View style={tw`flex w-full  border`}>
        <RenderSummary summary={userInfo.summary} />
      </View>
    </View>
  )
}



export default Profile