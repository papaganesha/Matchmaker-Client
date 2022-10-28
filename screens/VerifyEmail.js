import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button, TouchableHighlight, TextInput, ActivityIndicator } from 'react-native';
import React, { useState, useEffect } from 'react'
import { useNavigation } from '@react-navigation/native'
import VirtualKeyboard from 'react-native-virtual-keyboard';

import { useForm } from 'react-hook-form'


import tw from 'twrnc';
import Icon from 'react-native-vector-icons/FontAwesome'


const TextField = ({ label, ...inputProps }) => (
    <View style={tw`border w-1/6 rounded-lg mx-2`}>
        <Text style={tw``}>{label}</Text>
        <TextInput style={tw`w-full`}
            {...inputProps}
        />
    </View>
)



export default function VerifyEmail() {
    const navigation = useNavigation()
    const [loading, setLoading] = useState(false)

    const [text, setText] = useState("")
    const [textTwo, setTextTwo] = useState("")
    const [textThree, setTextThree] = useState("")
    const [textFour, setTextFour] = useState("")
    const [code, setCode] = useState([])

    useEffect(() => {
        setLoading(true)
        console.log("code on UseEffect: ", code)
        setTimeout(()=>{
            setLoading(false)
        }, 5000)
    }, [textFour])

    return (
        <View style={tw`flex w-full h-full bg-blue-500 p-4`}>
            <View style={tw`flex w-full h-3/12 justify-center items-center`}>
                <Text style={tw`pt-4 text-2xl font-bold text-white text-center`}>Verificar email</Text>
                <Text style={tw`px-10 text-center mt-3`}>Digite o codigo de verificação recebido</Text>
                {loading ? (
                    <View style={tw`flex w-full justify-center h-3/12 my-10`}>
                        <ActivityIndicator size="large" color="#FFF" />
                    </View>
                ) : (
                    <View style={tw`flex-row w-full justify-center items-center mt-10`}>
                        <TextField
                            value={text}
                            onChange={event => {
                                console.log(text, ...code)
                                setCode([...code, text])
                                console.log("code 1: ",event.target.value)
                            }}
                        />
                        <TextField
                            value={textTwo}
                            onChange={event => {
                                console.log(text, ...code)
                                setCode([...code, text])
                                console.log("code 2: ",event.target.value)
                            }}
                        />
                        <TextField
                            value={textThree}
                            onChange={event => {
                                console.log(text, ...code)
                                setCode([...code, text])
                                console.log("code 3: ",event.target.value)
                            }}
                        />
                        <TextField
                            value={textFour}
                            onChange={event => {
                                console.log(text, ...code)
                                setCode([...code, text])
                                console.log("code 4: ",event.target.value)
                            }}
                        />
                    </View>
                )}
            </View>

            <View style={tw`flex w-full h-5/12 mt-10`}>
                <VirtualKeyboard color='white' pressMode='string' onPress={(val) => {
                    if (text == "") {
                        setText(val)
                        console.log("val 1: ",val)
                    } else {
                        if (textTwo == "") {
                            setTextTwo(val[1])
                            console.log("val 2: ",val[1])
                        } else {
                            if (textThree == "") {
                                setTextThree(val[2])
                                console.log("val 3: ",val[2])
                            } else {
                                setTextFour(val[3])
                                console.log("val 4: ",val[3])
                            }
                        }
                    }
                    val=""

                }} />
            </View>

            <View style={tw`flex w-full h-2/12  items-center justify-start`}>
                <TouchableHighlight onPress={() => {
                    console.log("Enviar novamente clicado")
                }}>
                    <Text style={tw`pt-4 text-sm font-bold text-white text-center`}>Enviar novamente</Text>
                </TouchableHighlight>
            </View>
        </View>
    )
}


