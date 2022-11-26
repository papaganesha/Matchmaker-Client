import { View, Text,  ScrollView, ImageBackground, ActivityIndicator } from 'react-native'
import React, { useContext, useEffect } from 'react'
import tw from 'twrnc'
import Icon from 'react-native-vector-icons/FontAwesome'
import { AuthContext } from '../context/AuthContext';



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

const ProfileUserOnScreen = ({route, navigation}) => {
  const { userInfo, error, setError, isLoading } = useContext(AuthContext)
  const {user} = route.params
  
  const RenderPictures = () => {
    if (user.mainPicture) {
      const mainPicture = user.mainPicture
      return (
        <View style={tw`flex w-full h-full rounded-lg`}>
          <ImageBackground imageStyle={tw`rounded-lg`} style={tw`flex w-full h-full`} source={mainPicture ? { uri: mainPicture } : require("../assets/placeholder1.jpg")} >
          </ImageBackground>
        </View>

      )
    }
  }

  const RenderNamesAndAge = ({user}) => {
    return(
      <View style={tw`flex w-full items-start flex-row pt-5 `}>
      <Text
        style={tw` ml-8 text-2xl font-semibold`}
      >{`${user.fName} ${user.sName}`}</Text>
     
      <Text style={tw`text-2xl font-semibold`}>, {isLoading ? (<ActivityIndicator size={20} color="#FF0D" />) : (getAge(userInfo.birthDate))}</Text>
      </View>
    )
  }

  const RenderGenderAndOrientation = ({ user }) => {
    let returnG = ""
    let returnO = ""
    if (user.gender == 0) {
      returnG = "Homem"
    }
    if (user.gender == 1) {
      returnG = "Mulher"
    }
    if (user.gender == 2) {
      returnG = "Transexual Homem"
    }
    if (user.gender == 3) {
      returnG = "Transexual Mulher"
    }
    if (user.sexOrientation == 0) {
      returnO = "Heterosexual"
    }
    if (user.sexOrientation == 1) {
      returnO = "Bisexual"
    }
    if (user.sexOrientation == 2) {
      returnO = "Homosexual"
    }
    return (
    <View style={tw`flex w-full h-10 items-center flex-row `}>
      <Text
        style={tw`ml-8 font-semibold`}
      >{`${returnG}, ${returnO}`}</Text>
      </View>
      )
  }


  const RenderCity = ({city}) => {
    return (
      <View style={tw`mt-4`}>
        <Text style={tw`mt-2 ml-8 text-base font-bold`}>Cidade</Text>
        <Text style={tw`mt-2 ml-8  font-medium`}>{city}, Brasil</Text>
      </View>
    )
  }

  const RenderSummary = ({ summary }) => {
    return (
      <View style={tw`flex w-full h-48`}>
        <Text style={tw`mt-3 ml-8 text-base font-bold `}>Sobre</Text>
        <View style={tw` mx-8 rounded-lg bg-red-600 border-white h-30 px-3 pt-1 mt-3`}>
          <Text style={tw`mt-2 font-medium text-white`}>{summary}</Text>
        </View>
        <View style={tw`w-full items-end pr-9 pt-1`}>
        <Text>{summary.length}/400</Text>
      </View>
      </View>
    )
  }

  const RenderInterests = ({ interests }) => {
    if(interests) {
      return (
        <View style={tw`flex w-full h-auto`}>
          <Text style={tw`mt-3 ml-8 text-lg font-bold`}>Interesses</Text>
          <View style={tw`flex w-full flex-row flex-wrap font-bold justify-start px-6 pt-4`}>
            {interests.map(interest => {
              return (
                <View style={tw`flex flex-row border-white rounded-lg bg-red-600 ml-3 mb-3`} key={interest.interestName}>
                  <View style={tw`flex justify-center items-center w-14`}>
                    <Icon name={interest.iconName} style={tw``} size={18} color="white" />
                  </View>
                  <View style={tw`flex justify-center items-start h-9 w-24`}>
                    <Text style={tw`font-bold ml-1 text-white`}>{interest.interestName}</Text>
                  </View>
                </View>
              )
            })}
          </View>
        </View>
      )
    }
  }

 

  
  useEffect(() => {
    setError("")
  }, [])

  return (
    <View style={tw`flex-1 items-end w-full`}>
      <ScrollView style={tw`flex-1 w-full`}>
        <View style={tw`flex items-center w-full h-100 justify-center`}>
          <RenderPictures />
        </View>
        {!!error && <Text style={tw`flex w-85 mt-8 text-center text-base font-semibold border rounded p-1 self-center`}>{error}</Text>}

        <View style={tw`flex items-start w-full rounded`}>
       
          <RenderNamesAndAge user={user}/>

          <RenderGenderAndOrientation user={user} />
          <RenderCity city={user.city} />


          <View style={tw`flex w-full mt-4`}>
            <RenderSummary summary={user.summary} />
          </View>


          <View style={tw`flex w-full mb-10`}>
            <RenderInterests interests={user.interests} />
          </View>


        </View>
      </ScrollView>
    </View>
  )
}



export default ProfileUserOnScreen