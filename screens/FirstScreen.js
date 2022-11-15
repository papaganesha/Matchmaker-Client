
import React, {useState} from 'react'
import { View, Text, Button, Image } from 'react-native'
import { NavigationActions } from '@react-navigation/stack'
import tw from 'twrnc';
import FirstScreenSlider from './FirstScreenSlider'



export default FirstScreen = ({navigation}) => {
    const [loading, setLoading] = useState(true)
    setTimeout(()=> setLoading(false), 4000)

  if(loading){
    return (
        <View style={tw`flex-1 justify-center items-center bg-white`}>
            <View style={tw`w-3/4 h-full`}>
                 <Image resizeMode="contain" style={tw`w-full h-full`} source={require('../assets/logo.png')} />
            </View>
        </View>
    )
  }else{
    return (
        <View style={tw`flex-col w-full bg-white`}>
            <View style={tw`flex w-full h-9/12 bg-white justify-center pt-1`}>
                <FirstScreenSlider />
            </View>
            <View style={tw`flex w-full h-3/12 px-6 items-center`}>
                <View 
                style={tw`flex w-12/12 h-11 bg-red-600 justify-center items-center rounded-xl mt-4`}
                    onStartShouldSetResponder={() => {
                        console.log("Criar conta clicado")
                        navigation.navigate("SignUp")
                    }}
                >
                    <Text style={tw`text-white text-base `}>
                        Criar uma conta
                    </Text>  
                </View>
                <View style={tw`flex w-full h-2/5 pt-7 items-center`}>
                    <Text>
                        <Text>Já tem uma Conta? </Text>
                        <Text style={tw`text-red-600 hover:underline`} onPress={()=>{
                            console.log("Entrar Clicado")
                            navigation.navigate("SignIn")
                        }}>Entrar</Text>
                    </Text>
                </View>
            </View>
        </View>
      )
  }
}

