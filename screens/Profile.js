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
  const { userInfo, userToken, logout, refreshUserInfo } = useContext(AuthContext)
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
      return (<Image style={tw`flex w-full h-full rounded`} source={{ uri: mainPicture }} />)
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
        <Text style={tw`mt-2 ml-8 text-base font-bold`}>Cidade</Text>
        <Text style={tw`mt-2 ml-8  font-medium`}>{userInfo.city}, Brasil</Text>
      </View>
    )
  }

  const RenderSummary = ({ summary }) => {
    return (
      <View style={tw`flex w-full h-48 border`}>
        <Text style={tw`mt-3 ml-8 text-base font-bold`}>Sobre</Text>
        <View style={tw` ml-8 rounded`}>
          <Text style={tw`mt-2 font-medium`}>{summary}</Text>
        </View>
      </View>
    )
  }

  const RenderInterests = ({ interests }) => {
    return (
      <View style={tw`flex w-full h-auto`}>
        <Text style={tw`mt-3 ml-8 text-lg font-bold`}>Interesses</Text>
        <View style={tw`flex flex-row flex-wrap font-bold border rounded justify-center`}>
          {interests.map(interest => {
            return (
              <View>
                <View style={tw`flex justify-center items-center ml-3 mr-3 `}>
                  <Icon name={interest.iconName} style={tw``} size={20} color="black" />
                </View>
                <View style={tw`flex border justify-center items-center h-10 p-2 w-28`}>
                  <Text style={tw`font-bold`}>{interest.interestName}</Text>
                </View>
              </View>
            )
          })}
        </View>
      </View>
    )
  }

  useEffect(() => {
    getUserAge()
    refreshUserInfo()
  }, [])

  return (
    <View style={tw`flex-1 items-end w-full`}>
      <ScrollView style={tw`w-full`}>
        <View style={tw`flex items-center w-full h-1/4 justify-center`}>
          <RenderPictures />
        </View>

        <View style={tw`flex items-start w-full rounded`}>
          <Text style={tw` ml-8 text-2xl font-semibold pt-8`}>{userInfo.fName} {userInfo.sName}, {loading ? (<ActivityIndicator size={20} color="#FF0D" />) : (userAge)}</Text>
          <RenderGenderAndOrientation userInfo={userInfo} />
          <RenderCity city={userInfo.city} />
          <Text style={tw`mt-3 ml-8 font-semibold`}></Text>


          <View style={tw`flex w-full`}>
            <RenderSummary summary={userInfo.summary} />
          </View>


          <View style={tw`flex w-full`}>
            <RenderInterests interests={userInfo.interests} />
          </View>


          <View>
            <Text>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris nec pellentesque eros, at volutpat massa. Ut feugiat maximus nulla, sed tempor ipsum tempor tristique. Nunc pulvinar sapien vel arcu fringilla, id vestibulum tellus tincidunt. Curabitur in condimentum quam. Donec at aliquam tortor. Quisque iaculis finibus velit, ut tincidunt ante aliquam vehicula. Curabitur mauris erat, luctus vitae maximus vel, ullamcorper id velit. Integer faucibus, erat at posuere aliquet, erat eros elementum odio, et venenatis turpis mauris id massa. Maecenas efficitur orci lacinia, sagittis nulla et, aliquam felis. Sed pharetra ipsum in nulla viverra finibus. Nunc ex odio, ultricies eu accumsan id, pretium ut enim. Integer viverra ut quam eget varius. In erat sem, vehicula vel neque sed, ultrices rhoncus velit. </Text>
          </View>

          <View
            style={tw`flex w-20 h-10 border justify-start items-left rounded-2xl mr-5`}
            onStartShouldSetResponder={() => {
              logout()
            }}
          >
            <Text style={tw`text-white text-base justify-center items-center bg-red-500`}>
              <Icon name="sign-out" style={tw``} size={15} color="black" />
            </Text>
          </View>

        </View>
      </ScrollView>
    </View>
  )
}



export default Profile