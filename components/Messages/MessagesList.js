import React, { useState, useRef, useContext, useEffect } from "react";
import { ScrollView } from "react-native";
import { View, Text } from "react-native";
import tw from 'twrnc';

import { AuthContext } from "../../context/AuthContext";

import { CometChat } from '@cometchat-pro/react-native-chat';

import { BASE_URL } from '../../config'
import Message from "./Message";

const MessagesList = ({ onSwipeToReply, user, messages }) => {
	const { userInfo, userToken } = useContext(AuthContext)

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
				//console.log("Message list fetched:", messages);
				// for (let obj of messages) {
				//     //console.log("OBJ => ", obj)
				//     if (obj.receiverId == user._id && obj.action !== "deleted" && obj.text) {
				//         console.log(`MY MESSAGE ${obj.text} -- TIMESTAMP ${obj.sentAt}`);
				//         returnMessages.push({ sender: "yours", message: obj.text, timestamp: obj.sentAt })
				//     }
				//     if (obj.receiverId == userInfo._id && obj.action !== "deleted" && obj.text) {
				//         console.log(`MATCH MESSAGE ${obj.text} -- TIMESTAMP ${obj.sentAt}`);
				//         returnMessages.push({ sender: "match", message: obj.text, timestamp: obj.sentAt })
				//     }
				// }
				//console.log(messages)
				setMessages(messages)
			}, error => {
				console.log("Message fetching failed with error:", error);
			}
		);
	}

	const LoggedUser = useRef(userInfo._id);
	const scrollView = useRef();

	// useEffect(() => { 
	// 	returnAllConversation() 
	// }, [])

	return (
		<ScrollView style={{ backgroundColor: "white", flex: 1 }}
			ref={ref => scrollView.current = ref}
			onContentChange={() => {
				scrollView.current.scrollToEnd({ animated: true })
			}}
		>
			{messages.length > 0 ? messages.map((message, index) => (
				<Message
					key={index}
					time={message.sentAt}
					isLeft={message.sender.uid !== LoggedUser.current}
					message={message.text}
					onSwipe={onSwipeToReply}
				/>
			)):(
				<View style={tw`w-full items-center h-24 justify-center`}> 
					<Text  style={tw`px-8 py-2 text-base border border-gray-500 bg-gray-200 rounded`}>Mande a primeira mensagem</Text>
				</View>
			)}
		</ScrollView>
	);
};

export default MessagesList