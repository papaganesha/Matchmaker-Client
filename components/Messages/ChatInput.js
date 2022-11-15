import React, { useState, useEffect, useRef, memo } from "react";
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
	withSpring,
	withTiming,
	useAnimatedStyle,
} from "react-native-reanimated";

import Icon from "@expo/vector-icons/MaterialCommunityIcons";
import EmojiPicker from "./emojis/EmojiPicker";

import { useKeyboard } from "@react-native-community/hooks";


import { CometChat } from '@cometchat-pro/react-native-chat';

import { BASE_URL } from '../../config'


const ChatInput = ({ reply, closeReply, isLeft, username, user, returnAllConversation }) => {
	const [message, setMessage] = useState("");
	const height = useSharedValue(70);


	const sendMessage = (msg, receiverID) => {
		if (msg.length > 0) {
			let receiverType = CometChat.RECEIVER_TYPE.USER
			let textMessage = new CometChat.TextMessage(receiverID, msg, receiverType)

			CometChat.sendMessage(textMessage).then(
				message => {
					setMessage("")
					returnAllConversation()
				}, error => {
					console.log("Error while sent message: " + error.message)
				})
		}
	}

	useEffect(() => {
		returnAllConversation()
	}, []);



	const heightAnimatedStyle = useAnimatedStyle(() => {
		return {
			height: height.value
		}
	})


	return (
		<Animated.View style={[styles.container, heightAnimatedStyle]}>
			{reply ? (
				<View style={styles.replyContainer}>
					<TouchableOpacity
						onPress={closeReply}
						style={styles.closeReply}
					>
						<Icon name="close" color="#000" size={20} />
					</TouchableOpacity>
					<Text style={styles.title}>
						Responder para {isLeft ? username : "VocÊ"}
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
		marginHorizontal: 10,
		justifyContent: "space-between",
		alignItems: "center",
		flexDirection: "row",
		paddingVertical: 10,
	},
	inputAndMicrophone: {
		flexDirection: "row",
		backgroundColor: "white",
		flex: 3,
		marginRight: 10,
		paddingVertical: Platform.OS === "ios" ? 10 : 0,
		borderRadius: 30,
		alignItems: "center",
		justifyContent: "space-between",
	},
	input: {
		backgroundColor: "transparent",
		paddingLeft: 20,
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
		backgroundColor: "green",
		borderRadius: 50,
		height: 50,
		width: 50,
		alignItems: "center",
		justifyContent: "center",
	},
});

export default ChatInput;