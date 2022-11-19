import { View, Text, SafeAreaView, FlatList, ImageBackground, ActivityIndicator } from 'react-native'
import React, { useState, useContext, useEffect } from 'react'
import { TouchableOpacity } from "react-native-gesture-handler"
import tw from 'twrnc';
import axios from 'axios'
import { useNavigation } from '@react-navigation/native'
import { AuthContext } from '../context/AuthContext';
import { CometChat } from '@cometchat-pro/react-native-chat';
import { BASE_URL } from '../config'
import ConversationItem from '../components/ConversationItem'
import { useIsFocused } from "@react-navigation/core";


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



const Matchs = () => {
    const navigation = useNavigation()
    const isFocused = useIsFocused();
    const { userToken, error, setError } = useContext(AuthContext)
    const [noMessaged, setNoMessaged] = useState([])
    const [alreadyMessaged, setAlreadyMessaged] = useState([])
    const [usersInfo, setUsersInfo] = useState([])
    const [loading, setLoading] = useState(true)


    const getMatchs = async () => {
        const res = await axios.get(`${BASE_URL}matchs`, {
            headers: {
                'Authorization': `${userToken}`
            }
        })
        const json = await res.data.data
        setLoading(false)
        return json

    }

    // useEffect(() => {
    //     setLoading(true)
    //     getMatchs().then(users => {
    //         setNoMessaged(users.noMessaged)
    //         setAlreadyMessaged(users.alreadyMessaged)

    //     })
    //     setLoading(false)
    // }, [])


    useEffect(() => {
        getMatchs().then(users => {
            setNoMessaged(users.noMessaged)
            setAlreadyMessaged(users.alreadyMessaged)

        })

    }, [isFocused])



    const renderItemTop = ({ item }) => {
        return (
            <ItemTop item={item} getMatchs={getMatchs} />
        )
    }

    const renderItemBottom = ({ item }) => (
        <ItemBottom item={item} getMatchs={getMatchs} />
    );




    const RenderTop = () => {

        if (loading) {
            <View style={tw`flex-1 h-full w-full justify-center items-center`}>
                <ActivityIndicator size={25} color="black" />
            </View>
        } else {
            if (noMessaged.length > 0) {
                return (
                    <SafeAreaView style={tw`flex h-3/10  justify-center items-center flex-row`}>
                        <FlatList
                            style={tw` h-full pl-3 mr-4`}
                            data={noMessaged}
                            renderItem={renderItemTop}
                            keyExtractor={item => item._id}
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

    const RenderBottom = () => {
        if (loading) {
            <View style={tw`flex h-full w-full justify-center items-center`}>
                <ActivityIndicator size={25} color="black" />
            </View>
        } else {
            if (alreadyMessaged.length > 0) {
                return (
                    <SafeAreaView style={tw`flex h-full justify-center items-center flex-row`}>
                        <FlatList
                            style={tw` h-full pt-1 px-4`}
                            data={alreadyMessaged}
                            renderItem={renderItemBottom}
                            keyExtractor={item => item._id}
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
        <View style={tw`flex-1 justify-center items-center`}>
            <Text style={tw`text-3xl font-bold text-black`}>Sem Matches</Text>
            <Text style={tw`text-base font-bold text-black`}>Encontre novos matchs</Text>
        </View>
    )

    if(loading){
        return(
            <View style={tw`flex-1 justify-center items-center`}>
            <ActivityIndicator size={30} color="black"/>
            </View>
        )
    }   
    if ((alreadyMessaged.length + noMessaged.length) > 0) {
        return (
            <View style={tw`flex-1`}>
                <View style={tw`flex h-35 justify-end`}>
                    <Text style={tw`text-black text-3xl font-bold pl-5`}>Matchs</Text>
                    <Text style={tw`text-black text-lg font-bold pl-5 pt-2`}>Converse com estes Matchs</Text>
                </View>
                <RenderTop />
                {!!error && <Text style={tw`flex w-85 mt-7 mb-2 text-center text-base font-semibold border rounded p-1 self-center`}>{error.code}: {error.message}</Text>}

                <View style={tw`flex h-12 justify-end `}>
                    <Text style={tw`text-black text-3xl font-bold pl-5`}>Conversas</Text>
                </View>
                <View style={tw`flex h-full pt-2 px-1`}>
                    <RenderBottom />
                </View>
            </View >
        )
    } else {
        return (
            <NoMatchs />
        )
    }





}


const ItemTop = ({ item}) => {
    const navigation = useNavigation()
    return (
        <TouchableOpacity key={item._id} style={tw`flex my-4 mx-2 w-40 h-45 self-center border border-gray-400 rounded-lg shadow-xl`} onPress={() => {
            navigation.navigate("MessagesScreen", { user: item })
        }}>

            <ImageBackground imageStyle={tw`rounded-lg`} style={tw`flex w-full h-full self-center justify-end items-end`} source={item.mainPicture ? { uri: item.mainPicture } : require("../assets/placeholder1.jpg")}>
                <View style={tw`w-full h-10 bg-black opacity-76 items-center justify-center rounded`}>
                    <Text style={tw`text-base text-white font-semibold`}>{`${item.fName} ${item.sName}, ${returnAge(item.birthDate)}`}</Text>
                </View>
            </ImageBackground>
        </TouchableOpacity>
    )


}

const ItemBottom = ({ item }) => {
    const navigation = useNavigation()
    const [loading, setLoading] = useState(true)
    const [lastMessage, setLastMessage] = useState([])
    const [unreadMessages, setUnread] = useState([])

    const username = `${item.fName} ${item.sName}`


    
    function convertStringToDate(strTime) {
        var timestamp = Number(strTime) * 1000;
        var date = new Date(timestamp);
        var day = date.getDate();
        var month = date.getMonth()
        var year = date.getFullYear().toString().substr(-2)
        var hours = date.getHours();
        var minutes = date.getMinutes();
        var ampm = hours >= 12 ? "pm" : "am";
        hours = hours % 12;
        hours = hours ? hours : 12;
        minutes = minutes < 10 ? "0" + minutes : minutes;
        var timestr = `${hours}:${minutes} ${ampm}`
        var datestr = `${day}/${month}/${year}`
        return `${timestr} ${datestr}`
    }



    async function returnUnreadMessages(user){
        let unreadMessages = []
        let UID = user._id;
        let limit = 40;

        let messagesUnread = new CometChat.MessagesRequestBuilder()
            .setUID(UID)
            .setUnread(true)
            .setLimit(limit)
            .build();

        await messagesUnread.fetchPrevious().then(
            messages => {
                //console.log("Message list fetched:", messages[0]);
                messages.map(message => {
                    console.log(message.sender.uid, UID)
                    if(message.sender.uid == UID){
                        unreadMessages.push(message.text)
                    }
                })
            }, error => {
                console.log("Message fetching failed with error:", error);
            }
        )
        return unreadMessages

    }

    async function returnLastMessage(user) {
        let data
        let UID = user._id;
        let limit = 60;

        let messagesRequest = new CometChat.MessagesRequestBuilder()
            .setUID(UID)
            .setLimit(limit)
            .build();

        await messagesRequest.fetchPrevious().then(
            messages => {
                if (messages.length > 0) {
                    if (messages[messages.length - 1].sender.uid !== UID) {
                        data = { text: `Você disse ${messages[messages.length - 1].text}`, time: convertStringToDate(messages[messages.length - 1].sentAt), hasBlockedMe: messages[messages.length - 1].hasBlockedMe}
                    } else {
                        data = { text: `${messages[messages.length - 1].sender.name} disse ${messages[messages.length - 1].text}`, time: convertStringToDate(messages[messages.length - 1].sentAt), hasBlockedMe: messages[messages.length - 1].hasBlockedMe}
                    }
                }


            }, error => {
                setError(error)
            }
        );
        return data
    }


    useEffect(() => {
        returnLastMessage(item).then(res => {
            setLastMessage(res)
        })
        returnUnreadMessages(item).then(res => {
            setUnread(res)
        })
    }, [])

    


    return (
        <ConversationItem user={item} lastMessage={lastMessage.text} time={lastMessage.time} username={username} unreadMessages={unreadMessages} />
    )

}




export default Matchs


