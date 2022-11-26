import { Image,View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import tw from 'twrnc';
import axios from 'axios'
import { AuthContext } from '../context/AuthContext';
import { useNavigation } from '@react-navigation/native'
import * as ImagePicker from 'react-native-image-picker';
import Icon from 'react-native-vector-icons/FontAwesome'
import { BASE_URL } from '../config';


export default function SignUpPics() {
    const { error, setError } = useContext(AuthContext)

    useEffect(() => {
        setError("")
    }, [])

    return (
        <View style={tw`flex-1 w-full justify-center items-center bg-white`}>
            <View style={tw`flex w-full h-1/4 items-start justify-center px-4`}>
                <Text style={tw`text-3xl font-bold ml-6 pt-15`}>Escolha uma foto</Text>

            </View>
            {!!error && <View><Text style={tw`flex w-85 mb-2 text-center text-base font-semibold border rounded p-1 self-center`}>{error}</Text></View>}


            <FileInput />
        </View>
    )
}



const FileInput = () => {
    const navigation = useNavigation()

    let [loading, setLoading] = useState(false)

    const [profileImage, setProfileImage] = useState(null);

    const { userToken, setError } = useContext(AuthContext)
    const [showIcon, setShowIcon] = useState(true)


    const openImageLibraryAvatar = async () => {
        setShowIcon(false)
        setLoading(true)
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (status !== 'granted') {
            alert('Sorry, we need camera roll permissions to make this work!');
        }

        if (status === 'granted') {
            const response = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
            });


            if (!response.cancelled) {
                setProfileImage(response.uri)
                setShowIcon(false)
            } else {
                setError("Algo ocorreu durante a escolha, tente novamente")
                setShowIcon(true)
            }
        }
        setLoading(false)
    };

    const uploadProfileImage = async () => {
        const formData = new FormData();
        formData.append('profile', {
            name: new Date() + '_profile',
            uri: profileImage,
            type: 'image/jpg',
        });

        await axios.post(`${BASE_URL}uploadAvatar`, formData, {
            headers: {
                Authorization: `${userToken}`,
                Accept: 'application/json',
                'Content-Type': 'multipart/form-data',
            },
        }).then(res => {
            if (res.data.success) {
                if (profileImage) {
                    console.log("Upload feito com sucesso")
                    //setProfileImage(profileImage)
                    setError("Upload feito com sucesso")
                    //setProfileImage(response.uri)
                    setTimeout(() => navigation.navigate("SignUpInterests"), 2000)
                }
            }
        }).catch(err => {
            console.log("ERR ", err.response.data);
            setError("Faça upload novamente")
        });

    }





    const RenderImage = () => {
        if (loading) {
            return (
                <View style={tw`flex w-3/4 h-3/4 justify-center items-center`}>
                    <ActivityIndicator size={25} color="black" />
                </View>
            )
        }
        if (profileImage) {
            return (
                <Image
                    resizeMode="contain"
                    source={{ uri: profileImage }}
                    style={tw`flex w-75 h-75 justify-center items-center border rounded-full`}
                />
            )
        }
    }


    return (
        <View style={tw`flex-1 w-full bg-white`}>

            <View style={tw`flex w-full h-9/12 items-center justify-center`}>
                <TouchableOpacity
                    onPress={openImageLibraryAvatar}
                    style={tw`flex w-75 h-75 justify-center items-center border rounded-full border-dashed`}
                >
                    <RenderImage />
                    {showIcon && <Icon name="camera" size={30} color="black" style={tw``} />}

                </TouchableOpacity>
            </View>

            <View
                style={tw`flex w-85 h-10 bg-red-600 justify-center items-center rounded-lg mb-8 self-center shadow-lg`}
                onStartShouldSetResponder={() => {
                    uploadProfileImage()
                }}
            >
                <Text style={tw`text-white text-base font-semibold`}>
                    Continuar
                </Text>

            </View>
        </View>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        height: 200,
    },
    uploadBtnContainer: {
        height: '100%',
        width: '100%',
        borderRadius: 125 / 2,
        justifyContent: 'center',
        alignItems: 'center',
        borderStyle: 'dashed',
        borderWidth: 1,
        overflow: 'hidden',
    },
    uploadBtn: {
        textAlign: 'center',
        fontSize: 16,
        opacity: 0.3,
        fontWeight: 'bold',
    },
    skip: {
        textAlign: 'center',
        padding: 10,
        fontSize: 16,
        fontWeight: 'bold',
        textTransform: 'uppercase',
        letterSpacing: 2,
        opacity: 0.5,
    },
})
