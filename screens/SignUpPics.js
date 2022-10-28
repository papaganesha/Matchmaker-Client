import { Image, TextInput, View, Text, Button, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native'
import React, { Component, useContext, useEffect, useState } from 'react'
import tw from 'twrnc';
import axios from 'axios'
import { AuthContext } from '../context/AuthContext';
import { useNavigation, CommonActions } from '@react-navigation/native'
import * as ImagePicker from 'expo-image-picker';
import { AdvancedImage } from '@cloudinary/react';
import { Cloudinary } from '@cloudinary/url-gen';
import { fill } from "@cloudinary/url-gen/actions/resize";

import Icon from 'react-native-vector-icons/FontAwesome'


import { BASE_URL } from '../config';


export default function SignUpPics() {
    const navigation = useNavigation()
    const [error, setError] = useState("")
    let [loading, setLoading] = useState(false)
    const { userToken, userInfo } = useContext(AuthContext)

    const { logout } = useContext(AuthContext)

    return (
        <View style={tw`flex-1 w-full justify-center items-center pt-15`}>
            {!!error && <Text style={tw`w-full text-black my-2`}>{error}</Text>}
            <FileInput />

        </View>
    )
}



const FileInput = () => {
    const navigation = useNavigation()

    let [loading, setLoading] = useState(false)

    const [profileImage, setProfileImage] = useState(null);
    const [pictures, setPictures] = useState([])

    const { userToken, userInfo } = useContext(AuthContext)


    const openImageLibraryAvatar = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (status !== 'granted') {
            alert('Sorry, we need camera roll permissions to make this work!');
        }

        if (status === 'granted') {
            const response = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
            });

            uploadProfileImage()
            setProfileImage(response.uri);

            if (!response.cancelled) {
                setProfileImage(response.uri);
            }
        }
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
                console.log("Upload feito com sucesso")
            }
            console.log("RES ", res.data);
        }).catch(err => {
            console.log("ERR ", err.response.data.error);
        });
    }

    const openImageLibrary = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (status !== 'granted') {
            alert('Sorry, we need camera roll permissions to make this work!');
        }

        if (status === 'granted') {
            const response = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
            });

            uploadImage()
            setPictures([...pictures, response.uri])

            if (!response.cancelled) {
                setPictures(response.uri);
            }
        }
    }


    const uploadImage = async () => {
        const formData = new FormData();
        formData.append('picture', {
            name: new Date() + '_picture',
            uri: pictures,
            type: 'image/jpg',
        });
        await axios.post(`${BASE_URL}uploadpic`, formData, {
            headers: {
                Authorization: `${userToken}`,
                Accept: 'application/json',
                'Content-Type': 'multipart/form-data',
            },
        }).then(res => {
            if (res.data.success) {
                console.log("Upload feito com sucesso")
            }
            console.log("RES ", res.data);
        }).catch(err => {
            console.log("ERR ", err.response.data.error);
        });

    }

    const getUserPics = () => {
        setLoading(true)
        axios.get(`${BASE_URL}user`, {
            headers: {
                Authorization: `${userToken}`,
            }
        }
        ).then(res => {
            if (res.data.data.pictures !== []) {
                console.log(res.data.data.pictures)
                setPictures(res.data.data.pictures)
            }
        })
            .catch(err => {
                console.log(err.response.data.error)
                setError(err.response.data.error)
            })
        setLoading(false)
    }

    const RenderPictures = () => {
        console.log(pictures)
        if(pictures){
            pictures.map(elem => {
                console.log("drip")
                console.log(elem)
                return (<View style={tw`flex w-1/3 h-40  items-center justify-center p-2`}><Image style={tw`flex w-full h-full rounded-lg border`} source={{ uri: elem }} /></View>)
            })
        }
    }

    

    return (
        <View style={tw`flex-1 w-full bg-white`}>
            <View style={tw`flex w-full h-50 items-center border`}>
                <TouchableOpacity
                    onPress={openImageLibraryAvatar}
                    style={styles.uploadBtnContainer}
                >
                    {profileImage ? (
                        <Image
                            resizeMode="resize"
                            source={{ uri: profileImage }}
                            style={tw`w-full h-full self-center `}
                        />
                    ) : (
                        <Text style={styles.uploadBtn}>Upload Profile Image</Text>
                    )}
                </TouchableOpacity>
            </View>


            <View style={tw`flex w-full h-1/3 flex-row flex-wrap mt-15 px-6`}>
                <TouchableOpacity style={tw` w-1/3 h-40 justify-center p-4`} onPress={openImageLibrary}>
                    {loading ? (
                        <ActivityIndicator size="small" color="#FFF" />
                    ) : (
                        <Icon name="plus-square-o" style={tw``} size={100} color="black" />
                    )}
                </TouchableOpacity>
                <RenderPictures />
            </View>
            <View
                style={tw`flex w-11/12 h-10 bg-red-600 justify-center items-center rounded-2xl mb-8 self-center`}
                onStartShouldSetResponder={() => {
                    navigation.navigate("SignUpInterests")
                }}
            >
                <Text style={tw`text-white text-base`}>
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
    },
    uploadBtnContainer: {
        height: '80%',
        width: 275,
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
