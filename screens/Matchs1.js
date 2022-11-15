import { View, Text, SafeAreaView, FlatList, ImageBackground, ActivityIndicator } from 'react-native'
import React, { useState, useContext, useEffect } from 'react'
import { TouchableOpacity } from "react-native-gesture-handler"
import tw from 'twrnc';
import axios from 'axios'
import { useNavigation } from '@react-navigation/native'
import { AuthContext } from '../context/AuthContext';

import { CometChat } from '@cometchat-pro/react-native-chat';

import { BASE_URL } from '../config'
import { ScrollView } from 'react-native-gesture-handler';
import { Image } from 'react-native-elements';

import ConversationItem from '../components/ConversationItem'



const Matchs = () => {
    const navigation = useNavigation()

    const { userInfo, userToken, error, setError } = useContext(AuthContext)
    const [usersInfo, setUsersInfo] = useState([])
    const [noMessaged, setNoMessaged] = useState([])
    const [alreadyMessaged, setAlreadyMessaged] = useState([])
    const [loading, setLoading] = useState(false)

    const renderItemTop = ({ item }) => {
        return (
            <ItemTop item={item} />
        )
    }

    const renderItemBottom = ({ item }) => (
        <ItemBottom item={item} />
    );


    const returnIfHasMessaged = async (user) => {
        let returnVar
        let UID = user._id;
        let limit = 30;
        let messagesRequest = new CometChat.MessagesRequestBuilder()
            .setUID(UID)
            .setLimit(limit)
            .build();

        messagesRequest.fetchPrevious().then(
            messages => {
                if (messages.length > 0) {
                    returnVar = true
                } else {
                    returnVar = false
                }
            }, error => {
                setError(error)
                returnVar = true
            }
        );
        return returnVar

    }

    const getMatchs = async () => {
        setLoading(true)
        let returnAlreadyMessaged = []
        let returnNoMessaged = []
        axios.get(`${BASE_URL}matchs`, {
            headers: {
                'Authorization': `${userToken}`
            }
        })
            .then(res => {
                //console.log("=>", res.data)
                if (res.data.success) {
                    //console.log(res.data)
                    setUsersInfo(res.data.data)

                    usersInfo.map((user, index) => {
                        let UID = user._id;
                        let limit = 30;
                        let messagesRequest = new CometChat.MessagesRequestBuilder()
                            .setUID(UID)
                            .setLimit(limit)
                            .build();

                        messagesRequest.fetchPrevious().then(
                            messages => {
                                //console.log(messages.length)
                                if (messages.length > 0) {
                                    console.log(true)
                                    //returnAlreadyMessaged.push(user)
                                    let checkUser = alreadyMessaged.filter(sender => sender._id == user._id)
                                    if (checkUser.length == 0) {
                                        setAlreadyMessaged([...alreadyMessaged, user])
                                    }

                                } else {
                                    console.log(false)
                                    //returnNoMessaged.push(user)
                                    let checkUser = noMessaged.filter(sender => sender._id == user._id)
                                    if (checkUser.length == 0) {
                                        setNoMessaged([...noMessaged, user])
                                    }

                                }
                            }, error => {
                                setError(error)
                            }
                        )
                    })

                    // setAlreadyMessaged(returnAlreadyMessaged)
                    // setNoMessaged(returnNoMessaged)
                    // console.log("already ", alreadyMessaged)
                    // console.log("no ", noMessaged)

                }

            })
            .catch(err => {
                console.log("GET USERS ERROR: ", err)
                setError(err.response.data.error)
            })
        setLoading(false)
    }

    const RenderTopCards = () => {
        if (loading) {
            return (
                <ActivityIndicator color="black" size={15} />
            )
        } else {

            if (noMessaged.length > 0) {
                return (
                    <SafeAreaView style={tw`flex h-3/10  justify-center items-center flex-row`}>
                        <FlatList
                            style={tw` h-full pl-3 mr-4`}
                            data={noMessaged}
                            renderItem={renderItemTop}
                            keyExtractor={item => item.id}
                            horizontal={true}
                        />
                    </SafeAreaView>
                )
            } else {
                return (
                    <View style={tw`flex h-3/10  justify-center items-center`}>
                        <Text style={tw`text-black`}>Encontre novos matchs</Text>
                    </View>
                )
            }
        }
    }

    const RenderBottomCards = () => {
        if (loading) {
            return (
                <ActivityIndicator color="black" size={15} />
            )
        } else {

            if (alreadyMessaged.length > 0) {
                return (
                    <SafeAreaView style={tw`flex h-full justify-center items-center flex-row`}>
                        <FlatList
                            style={tw` h-full pt-1 px-4`}
                            data={alreadyMessaged}
                            renderItem={renderItemBottom}
                            keyExtractor={item => item.id}
                            vertical={true}
                        />
                    </SafeAreaView>
                )
            } else {
                return (
                    <View style={tw`flex h-75  justify-center items-center `}>
                        <Text style={tw`text-black`}>Inicie uma conversa</Text>
                    </View>
                )
            }
        }
    }

    const NoMatchs = () => (
        <View style={`w-full border bg-red-500`}>
                    <Text style={`text-2xl font-bold text-black`}>Sem Matches</Text>
                    <Text style={`font-bold text-black`}>Encontre novos matchs</Text>
            </View>
    )

    useEffect(() => {
        getMatchs()
        setError("")

    }, [])


        return (
            <View style={tw`flex-1`}>
                <View style={tw`flex h-35 justify-end`}>
                    <Text style={tw`text-black text-3xl font-bold pl-5`}>Matchs</Text>
                    <Text style={tw`text-black text-lg font-bold pl-5 pt-2`}>Converse com estes Matchs</Text>
                </View>
                <RenderTopCards />

                {!!error && <Text style={tw`flex w-85 mt-7 mb-2 text-center text-base font-semibold border rounded p-1 self-center`}>{error.code}: {error.message}</Text>}

                <View style={tw`flex h-12 justify-end `}>
                    <Text style={tw`text-black text-3xl font-bold pl-5`}>Conversas</Text>
                </View>
                <View style={tw`flex h-full pt-4`}>
                    <RenderBottomCards />
                </View>
            </View >
        )
  
}



export default Matchs

function returnAge(dateString) {
    var today = new Date();
    var birthDate = new Date(dateString);
    var age = today.getFullYear() - birthDate.getFullYear();
    var m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
}

const ItemTop = ({ item }) => {
    const navigation = useNavigation()

    return (
        <TouchableOpacity style={tw`flex my-4 mx-2 w-40 h-45 self-center border rounded`} onPress={() => {
            console.log("AQUI")
            navigation.navigate("MessagesScreen", { user: item })
        }}>

            <ImageBackground style={tw`flex w-full h-full self-center rounded justify-end items-end`} source={item.mainPicture ? { uri: item.mainPicture } : require("../assets/placeholder1.jpg")}>
                <View style={tw`w-full h-10 border bg-black opacity-75 items-center justify-center`}>
                    <Text style={tw` text-white font-semibold`}>{`${item.fName} ${item.sName}, ${returnAge(item.birthDate)}`}</Text>
                </View>
            </ImageBackground>
        </TouchableOpacity>
    )


}


const ItemBottom = ({ item }) => {
    const navigation = useNavigation()
    const [lastMessage, setLastMessage] = useState([])


    function returnLastMessage(user) {
        let UID = user._id;
        let limit = 30;
        let messagesRequest = new CometChat.MessagesRequestBuilder()
            .setUID(UID)
            .setLimit(limit)
            .build();

        messagesRequest.fetchPrevious().then(
            messages => {
                //console.log(messages)
                if (messages.length > 0) {
                    if (messages[messages.length - 1].sender.uid !== UID) {
                        setLastMessage({ text: `Você disse ${messages[messages.length - 1].text}`, time: messages[messages.length - 1].sentAt, hasBlockedMe: messages[messages.length - 1].hasBlockedMe })
                    } else {
                        setLastMessage({ text: `${messages[messages.length - 1].sender.name} disse ${messages[messages.length - 1].text}`, time: messages[messages.length - 1].sentAt, hasBlockedMe: messages[messages.length - 1].hasBlockedMe })
                    }
                    console.log(lastMessage)
                }
            }, error => {
                setError(error)
            }
        );
    }

    useEffect(() => {
        returnLastMessage(item)
    }, [])


    return (
        <ConversationItem user={item} lastMessage={lastMessage.text} time={lastMessage.time} username={`${item.fName} ${item.sName}`} returnLastMessage={returnLastMessage} />
    )
}