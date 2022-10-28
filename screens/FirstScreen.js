// DUAS DIVS
// TOPO: DIV COM 80% DO TAMANHO
// TOPO: DIV CONTEM CARROUSEL AUTOMATICO DE IMAGENS, 3 IMAGENS, CADA UMA COM SEU TITUTLO E LEGENDA EMBAIXO

// BOTTOM: DIV COM 20% DO TAMANHO
// BOTTOM: DIV CONTEM UM BOTAO PARA CRIAR CONTA E EMBAIXO DESTE BOTAO UM TEXTO REDICRECIONANDO AO LOGIN

import React from 'react'
import { View, Text, Button } from 'react-native'
import { useNavigation } from '@react-navigation/native'

import tw from 'twrnc';
import FirstScreenSlider from './FirstScreenSlider'



export default FirstScreen = () => {
    const navigation = useNavigation()

  return (
    <View style={tw`flex-col w-full bg-white`}>
        <View style={tw`flex w-full h-9/12 bg-white justify-center`}>
            <FirstScreenSlider />
        </View>
        <View style={tw`flex w-full h-3/12 px-6 items-center`}>
            <View 
            style={tw`flex w-12/12 h-11 bg-red-600 justify-center items-center rounded-xl mt-8`}
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

