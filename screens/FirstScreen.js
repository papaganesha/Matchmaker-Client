
import React from 'react'
import { View, Text} from 'react-native'
import tw from 'twrnc';
import FirstScreenSlider from './FirstScreenSlider'



export default FirstScreen = ({navigation}) => {
    return (
        <View style={tw`flex-col w-full bg-white`}>
            <View style={tw`flex w-full h-9/12 bg-white justify-center pt-1`}>
                <FirstScreenSlider />
            </View>
            <View style={tw`flex w-full h-3/12 px-6 items-center`}>
                <View 
                style={tw`flex w-12/12 h-11 bg-red-600 justify-center items-center rounded-xl mt-4 shadow-lg`}
                    onStartShouldSetResponder={() => {
                        console.log("Criar conta clicado")
                        navigation.navigate("SignUp")
                    }}
                >
                    <Text style={tw`text-white text-base font-semibold`}>
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

