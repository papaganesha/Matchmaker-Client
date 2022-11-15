import React, { useState, useContext } from "react";
import { useEffect } from "react";
import { View, Text, ActivityIndicator } from "react-native";

import ChatHeader from "../components/Messages/ChatHeader";
import ChatInput from "../components/Messages/ChatInput";
import MessagesList from "../components/Messages/MessagesList";

import { CometChat } from '@cometchat-pro/react-native-chat';
import { AuthContext } from "../context/AuthContext";


const MessagesScreen = ({ navigation, route }) => {
	const { user } = route.params;
	const [reply, setReply] = useState("");
	const [isLeft, setIsLeft] = useState();
	const [loading, setLoading]= useState(false)
	const [messages, setMessages] = useState([])
	const {userInfo, userToke, error, setError} = useContext(AuthContext)

	const createMsgListener = () => {
		let listenerID = "GLOBAL_LISTENER_ID"
	
		CometChat.addMessageListener(
		  listenerID,
		  new CometChat.MessageListener({
			onTextMessageReceived: textMessage => {
			  console.log("Text message received: ",textMessage)
			  returnAllConversation()
			},
			onMediaMessageReceived: mediaMessage => {
			  console.log("Media message received: ",mediaMessage)
			},
			onCustomMessageReceived: customMessage => {
			  console.log("Custom message received: ",customMessage)
			}
		  })
		  )
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
				setMessages(messages)
			}, error => {
				setError(`Message fetching failed with error ${error}`)
			}
		);
	}


	const swipeToReply = (message, isLeft) => {
		setReply(message.length > 50 ? message.slice(0, 50) + '...' : message);
		setIsLeft(isLeft);
	};

	const closeReply = () => {
		setReply("");
	};
    
	useEffect(() => {
		returnAllConversation()
		createMsgListener()
	},[])

	return (
			<View style={{ flex: 1 }}>
				<ChatHeader
					onPress={() => {navigation.navigate("ProfileUserOnScreen", {user: user})}}
					username={`${user.fName} ${user.sName}`}
					picture={user.mainPicture}
					onlineStatus={'Online'}
				/>
				<MessagesList user={user} onSwipeToReply={swipeToReply} messages={messages}/>
				<ChatInput reply={reply} isLeft={isLeft} closeReply={closeReply} username={`${user.fName} ${user.sName}`} user={user} returnAllConversation={returnAllConversation}/>
			</View>
	);

	
};

export default MessagesScreen;