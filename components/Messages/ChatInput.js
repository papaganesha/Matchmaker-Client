import React, { useState, useEffect, useRef, memo, useContext } from "react";
import {
	View,
	Text,
	StyleSheet,
	TextInput,
	Platform,
	TouchableOpacity,
} from "react-native";

import Animated, {
	useSharedValue,
	useAnimatedStyle,
} from "react-native-reanimated";

import tw from 'twrnc';

import axios from 'axios'

import Icon from 'react-native-vector-icons/FontAwesome'


import { CometChat } from '@cometchat-pro/react-native-chat';

import { BASE_URL } from '../../config'

import { AuthContext } from '../../context/AuthContext';
import { Message } from "@flyerhq/react-native-chat-ui";



const ChatInput = ({ reply, closeReply, isLeft, username, user, returnAllConversation }) => {
	const [message, setMessage] = useState("");
	const height = useSharedValue(70);
	const { userToken } = useContext(AuthContext)

	const changeConversationInitiated = async (matchId) => {
		const res = await axios.post(`${BASE_URL}conversationInitiliazed`, {
			matchId
		}, {
			headers: {
				'Authorization': `${userToken}`
			}
		})

		const json = await res.data
		//console.log("JSON ",json)
		if(json !== true){
			const res2 = await axios.put(`${BASE_URL}conversationInitiliazed`, {
				matchId,
				conversationInitiated: true
			}, {
				headers: {
					'Authorization': `${userToken}`
				}
			})
		}


	}


	const setDeliveredMessages = (message) =>{
		CometChat.markAsDelivered(message.id, message.receiver.uid, 'user', message.sender.uid).then(
			() => {
				console.log("mark as delivered success.");
				returnAllConversation()
			}, error => {
				console.log("An error occurred when marking the message as delivered.", error);
			}
		);
	}

	const sendMessage = (msg, receiverID) => {
		if (msg.length > 0) {
			let trimmedMsg = msg.trim()
			let receiverType = CometChat.RECEIVER_TYPE.USER
			let textMessage = new CometChat.TextMessage(receiverID, trimmedMsg, receiverType)

			CometChat.sendMessage(textMessage).then(
				message => {
					changeConversationInitiated(receiverID)
					//setDeliveredMessages(message)
					setMessage("")
					returnAllConversation()	
				}, error => {
					console.log("Error while sent message: " + error.message)
				})
		}

		
	}

	useEffect(() => {
		// returnAllConversation()
	}, []);



	const heightAnimatedStyle = useAnimatedStyle(() => {
		return {
			height: height.value
		}
	})


	return (
		<Animated.View style={[styles.container, heightAnimatedStyle]}>
			{reply ? (
				<View style={tw`justify-center items-start mx-2 px-2 `}>
					<TouchableOpacity
						onPress={closeReply}
						style={tw`mt-1`}
					>
						<Icon name="close" color="#000" size={20} />
					</TouchableOpacity>
					<Text style={styles.title}>
						Responder para {isLeft ? username : "Você"}
					</Text>
					<Text style={styles.reply}>{reply}</Text>
				</View>
			) : null}
			<View style={styles.innerContainer}>
				<View style={styles.inputAndMicrophone}>
					<TextInput
						multiline
						placeholder={"Digite um mensagem..."}
						style={styles.input}
						value={message}
						onChangeText={(text) => setMessage(text)}
					/>

				</View>
				<TouchableOpacity style={styles.sendButton}
					onPress={() => {
						sendMessage(message, user._id)
					}}
				>
					<Icon
						name={"send"}
						size={23}
						color={"white"}
					/>
				</TouchableOpacity>
			</View>
		</Animated.View>
	);
};

const styles = StyleSheet.create({
	container: {
		justifyContent: "center",
		backgroundColor: "white",
	},
	replyContainer: {
		paddingHorizontal: 10,
		marginHorizontal: 10,
		justifyContent: "center",
		alignItems: "flex-start",
	},
	title: {
		marginTop: 5,
		fontWeight: "bold",
	},
	closeReply: {
		position: "absolute",
		right: 10,
		top: 5,
	},
	reply: {
		marginTop: 5,
	},
	innerContainer: {
		paddingHorizontal: 10,
		justifyContent: "space-between",
		alignItems: "center",
		flexDirection: "row",
		paddingVertical: 10,
		borderWidth:2,
		borderColor:"#DC2626",
		borderRadius: 7,
	},
	inputAndMicrophone: {
		flexDirection: "row",
		backgroundColor: "white",
		flex: 3,
		marginRight: 8,
		paddingVertical: Platform.OS === "ios" ? 10 : 0,
		borderRadius: 20,
		borderColor:"#DC2626",
		alignItems: "center",
		justifyContent: "space-between",
		borderWidth: 2,
	},
	input: {
		backgroundColor: "transparent",
		paddingLeft: 15,
		color: "black",
		flex: 3,
		fontSize: 15,
		height: 50,
		alignSelf: "center",

	},
	rightIconButtonStyle: {
		justifyContent: "center",
		alignItems: "center",
		paddingRight: 15,
		paddingLeft: 10,
		borderLeftWidth: 1,
		borderLeftColor: "#fff",
	},
	swipeToCancelView: {
		flexDirection: "row",
		alignItems: "center",
		marginRight: 30,
	},
	swipeText: {
		color: "red",
		fontSize: 15,
	},
	emoticonButton: {
		justifyContent: "center",
		alignItems: "center",
		paddingLeft: 10,
	},
	recordingActive: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		paddingLeft: 10,
	},
	recordingTime: {
		color: "red",
		fontSize: 20,
		marginLeft: 5,
	},
	microphoneAndLock: {
		alignItems: "center",
		justifyContent: "flex-end",
	},
	lockView: {
		backgroundColor: "#eee",
		width: 60,
		alignItems: "center",
		borderTopLeftRadius: 30,
		borderTopRightRadius: 30,
		height: 130,
		paddingTop: 20,
	},
	sendButton: {
		backgroundColor: "#DC2626",
		borderRadius: 50,
		height: 50,
		width: 50,
		alignItems: "center",
		justifyContent: "center",
	},
});

export default ChatInput;