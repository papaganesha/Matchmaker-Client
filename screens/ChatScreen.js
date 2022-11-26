import { View, Text, TextInput } from 'react-native'
import React, { useState, useContext, useEffect } from 'react'
import { TouchableOpacity } from "react-native-gesture-handler"
import tw from 'twrnc';
import Icon from 'react-native-vector-icons/FontAwesome';
import { CometChat } from '@cometchat-pro/react-native-chat';

import { Image } from 'react-native-elements';
import { ScrollView } from 'react-native-gesture-handler';
import { AuthContext } from '../context/AuthContext';





const ChatScreen = ({ route, navigation }) => {
    const [message, setMessage] = useState()
    const [placeholderStr, setPlaceholder] = useState("")
    const { user } = route.params
    const { userInfo, userToken } = useContext(AuthContext)
    const [messages, setMessages] = useState([])


    useEffect(() => {
        returnAllConversation()
    }, [])

    const sendMessage = (msg, receiverID) => {
        console.log(message, receiverID)
        //let receiverID = "global"
        let receiverType = CometChat.RECEIVER_TYPE.USER
        let textMessage = new CometChat.TextMessage(receiverID, msg, receiverType)

        CometChat.sendMessage(textMessage).then(
            message => {
                console.log("Message sent: " + message)
                setMessage("")
                returnAllConversation()
            }, error => {
                console.log("Error while sent message: " + error.message)
            })
    }

    const yourReceivedMessages = async () => {
        let UID = userInfo._id;
        let limit = 30;
        let latestId = await CometChat.getLastDeliveredMessageId();

        var messagesRequest = new CometChat.MessagesRequestBuilder()
            .setUID(UID)
            .setMessageId(latestId)
            .setLimit(limit)
            .build();

        messagesRequest.fetchNext().then(
            messages => {
                console.log("Your Message list fetched:", messages);
            }, error => {
                console.log("Your Message fetching failed with error:", error);
            }
        );
    }

    const matchReceivedMessages = async () => {
        let UID = user._id;
        let limit = 30;
        let latestId = await CometChat.getLastDeliveredMessageId();

        var messagesRequest = new CometChat.MessagesRequestBuilder()
            .setUID(UID)
            .setMessageId(latestId)
            .setLimit(limit)
            .build();

        messagesRequest.fetchNext().then(
            messages => {
                console.log("Their Message list fetched:", messages);
            }, error => {
                console.log("Their Message fetching failed with error:", error);
            }
        );
    }

    const returnAllConversation = () => {
        let UID = user._id;
        let limit = 30;
        let messagesRequest = new CometChat.MessagesRequestBuilder()
            .setUID(UID)
            .setLimit(limit)
            .build();

        messagesRequest.fetchPrevious().then(
            messages => {
                let returnMessages = []
                console.log("Message list fetched:", messages);
                for (let obj of messages) {
                    //console.log("OBJ => ", obj)
                    if (obj.receiverId == user._id && obj.action !== "deleted" && obj.text) {
                        console.log(`MY MESSAGE ${obj.text} -- TIMESTAMP ${obj.sentAt}`);
                        returnMessages.push({ sender: "yours", message: obj.text, timestamp: obj.sentAt })
                    }
                    if (obj.receiverId == userInfo._id && obj.action !== "deleted" && obj.text) {
                        console.log(`MATCH MESSAGE ${obj.text} -- TIMESTAMP ${obj.sentAt}`);
                        returnMessages.push({ sender: "match", message: obj.text, timestamp: obj.sentAt })
                    }
                }
                setMessages(returnMessages)
            }, error => {
                console.log("Message fetching failed with error:", error);
            }
        );
    }

    const RenderMessages = () => {
        let returnMessages = []
        if (messages.length > 0) {
            let orderedMsgs = messages.sort(function (a, b) {
                return a.timestamp - b.timestamp;
            });

            console.log("ordered => ", orderedMsgs)

            return (
                <View style={tw`flex w-full h-full flex-row`}>

                    <View style={tw`flex w-2/4 h-full items-start pl-2`}>
                        {orderedMsgs.map((obj, index) => {
                            if (obj.sender == "match") {
                                return (
                                    <View style={tw`bg-gray-200 p-3 w-11/12 h-15 justify-center items-center border rounded mt-5`}>
                                        <Text>{obj.message}</Text>
                                    </View>
                                )
                            }
                        })
                        }
                    </View>
                    <View style={tw`flex w-2/4 h-full items-end pr-2`}>
                        {orderedMsgs.map((obj, index) => {
                            if (obj.sender == "yours") {
                                if(index == 0){
                                    return (
                                        <View style={tw`bg-gray-200 p-3 w-11/12 h-15 justify-center items-center border rounded mt-5`}>
                                            <Text>{obj.message}</Text>
                                        </View>
                                    )
                                }else{
                                    return (
                                        <View style={tw`bg-gray-200 p-3 w-11/12 h-15 justify-center items-center border rounded mt-10`}>
                                            <Text>{obj.message}</Text>
                                        </View>
                                    )
                                }
                            }
                        })
                        }
                    </View>
                </View>
            )

        }
    }

    return (
        <View style={tw`flex-1 border bg-gray-200`}>
            <TouchableOpacity className="pressable" style={tw`flex mt-8 mx-2 w-full h-15 self-center flex-row`} onPress={() => {
                console.log("AQUI")
                navigation.navigate("ProfileUserOnScreen", {user:user})
            }}>

                <View style={tw`flex w-1/4 h-full justify-center items-center`}>
                    <Image style={tw`flex w-10 h-10 self-center rounded-full`} source={user.mainPicture ? { uri: user.mainPicture } : require("../assets/placeholder1.jpg")} />
                </View>
                <View style={tw`flex flex-col w-full h-full  opacity-75 items-center justify-center `}>
                    <View style={tw`w-full h-2/4`}>
                        <Text style={tw`text-xl text-black font-semibold`}>{`${user.fName} ${user.sName}`}</Text>
                    </View>
                </View>
            </TouchableOpacity>
            <ScrollView style={tw`flex w-full h-full min-h-10 bg-white`}>
                <RenderMessages />
            </ScrollView>
            <View style={tw`flex w-full h-12 flex-row`} >
                <View style={tw`flex w-9/10 h-full`}>
                    <TextInput
                        style={tw`flex w-full h-10 pl-2 pt-2`}
                        value={message}
                        onChangeText={text => {
                            setMessage(text)
                        }}
                        placeholder={placeholderStr}
                    />
                </View>
                <TouchableOpacity style={tw`flex w-full px-1 py-3`} onPress={() => {
                    if (message) {
                        sendMessage(message, user._id)
                    } else {
                        setPlaceholder("Digite uma mensagem...")
                    }
                }}>
                    <Icon name="send" size={20} color="black" style={tw``} />
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default ChatScreen

