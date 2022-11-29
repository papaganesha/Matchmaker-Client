import { View, Text, BackHandler  } from 'react-native'
import React, { useEffect } from 'react'
import { Image } from 'react-native-elements';
import tw from 'twrnc';
import { useNavigation } from '@react-navigation/native'


function handleBackButtonClick() {
    const navigation = useNavigation()

    navigation.goBack();
    return true;
  }

const MatchAnimation = ({ route }) => {
    const navigation = useNavigation()
    const { userInfo, matchInfo } = route.params

    useEffect(()=>{
        BackHandler.addEventListener("hardwareBackPress", handleBackButtonClick);
        return () => {
          BackHandler.removeEventListener("hardwareBackPress", handleBackButtonClick);
        };
    },[])

    return (
        <View style={tw`flex-1  bg-black`}>
            <View style={tw`w-full h-2/6 justify-center `}>
                <Text style={tw`text-white text-5xl text-center mb-4 pt-14`}>É um Match</Text>
                <Text style={tw`text-white text-center mb-2 text-base`}>Você e {`${matchInfo.fName}`} gostaram um do outro</Text>
            </View>
            <View style={tw`flex w-full h-2/6 flex-row items-center `}>
                <View style={tw`flex w-2/4 h-full justify-center border items-end`}>
                    <Image  style={tw`h-35 w-35 rounded-full border border-white mr-2`} source={{uri:userInfo.mainPicture}}/>
                </View>
                <View style={tw`flex w-2/4 h-full justify-center  items-start`}>
                    <Image  style={tw`h-35 w-35 rounded-full border border-white ml-2`} source={{uri:matchInfo.mainPicture}}/>
                </View>
            </View>
            <View style={tw`w-full h-4/12 items-center justify-center`}>
            <View onStartShouldSetResponder={()=> navigation.goBack()} style={tw`w-9/12 h-15 justify-center items-center border border-white rounded`}>
                <Text style={tw`text-white`}>
                    Continuar escolhendo
                </Text>
            </View>
            </View>
        </View>
    )
}

export default MatchAnimation