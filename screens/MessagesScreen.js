import React, { useState} from "react";
import { useEffect } from "react";
import { View} from "react-native";

import ChatHeader from "../components/Messages/ChatHeader";
import ChatInput from "../components/Messages/ChatInput";
import MessagesList from "../components/Messages/MessagesList";

import { CometChat } from '@cometchat-pro/react-native-chat';


const MessagesScreen = ({ navigation, route }) => {
	const { user } = route.params;
	const [reply, setReply] = useState("");
	const [isLeft, setIsLeft] = useState();
	const [messages, setMessages] = useState([])

	const createMsgListener = () => {
		let listenerID = "GLOBAL_LISTENER_ID"

		CometChat.addMessageListener(
			listenerID,
			new CometChat.MessageListener({
				onTextMessageReceived: textMessage => {
					console.log("Text message received: ", textMessage.text)
					returnAllConversation()
					refreshUnread()

				},
				onMediaMessageReceived: mediaMessage => {
					console.log("Media message received: ", mediaMessage)
				},
				onCustomMessageReceived: customMessage => {
					console.log("Custom message received: ", customMessage)
				}
			})
		)
	}
	

	const returnAllConversation = () => {
		let UID = user._id;
		let limit = 100;
		let messagesRequest = new CometChat.MessagesRequestBuilder()
			.setUID(UID)
			.setLimit(limit)
			.build();

		messagesRequest.fetchPrevious().then(
			messages => {
				//console.log(messages[messages.length - 1])
				setMessages(messages)
			}, error => {
				console.log(`Message fetching failed with error ${error}`)
			}
		)
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
	}, [])

	return (
		<View style={{ flex: 1 }}>
			<ChatHeader
				onPress={() => { navigation.navigate("ProfileUserOnScreen", { user: user }) }}
				username={`${user.fName} ${user.sName}`}
				picture={user.mainPicture}
				onlineStatus={'Online'}
			/>
			<MessagesList user={user} onSwipeToReply={swipeToReply} messages={messages} returnAllConversation={returnAllConversation} />
			<ChatInput reply={reply} isLeft={isLeft} closeReply={closeReply} username={`${user.fName} ${user.sName}`} user={user} returnAllConversation={returnAllConversation} />
		</View>
	);


};

export default MessagesScreen;