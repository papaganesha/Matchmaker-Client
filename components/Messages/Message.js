import React, { useState, useRef } from "react";
import { useEffect } from "react";
import { View, Text, StyleSheet, Alert, ActivityIndicator } from "react-native";
import {
	FlingGestureHandler,
	Directions,
	State,
} from "react-native-gesture-handler";
import Animated, {
	withSpring,
	useAnimatedStyle,
	useAnimatedGestureHandler,
	useSharedValue
} from "react-native-reanimated";

import { CometChat } from '@cometchat-pro/react-native-chat';



const Message = ({ messageId, senderId, time, isLeft, message, onSwipe }) => {
	const startingPosition = 0;
	const x = useSharedValue(startingPosition);

	const setReadMessages = (message) => {
		console.log("mes", message)
		CometChat.markAsRead(messageId, senderId, 'user', senderId).then(
			() => {
				console.log("mark as read success.");
			}, error => {
				console.log("An error occurred when marking the message as read.", error);
			}
		);
	}

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


	const isOnLeft = (type) => {
		if (isLeft && type === "messageContainer") {
			return {
				alignSelf: "flex-start",
				backgroundColor: "#f0f0f0",
				borderTopLeftRadius: 0,
			};
		} else if (isLeft && type === "message") {
			return {
				color: "#000",
			};
		} else if (isLeft && type === "time") {
			return {
				color: "gray",
				fontWeight: "bold"
			};
		} else {
			return {
				borderTopRightRadius: 0,
			};
		}
	};

	const eventHandler = useAnimatedGestureHandler({
		onStart: (event, ctx) => {

		},
		onActive: (event, ctx) => {
			x.value = isLeft ? 50 : -50;
		},
		onEnd: (event, ctx) => {
			x.value = withSpring(startingPosition);
		}
	});

	const uas = useAnimatedStyle(() => {
		return {
			transform: [{ translateX: x.value }]
		}
	});

	useEffect(() => {
		convertStringToDate(time)
		setReadMessages(message)
	}, [])

	return (
		<FlingGestureHandler
			direction={isLeft ? Directions.RIGHT : Directions.LEFT}
			onGestureEvent={eventHandler}
			onHandlerStateChange={({ nativeEvent }) => {
				if (nativeEvent.state === State.ACTIVE) {
					onSwipe(message, isLeft);
				}
			}}
		>
			<Animated.View style={[styles.container, uas]}>
				<View
					style={[
						styles.messageContainer,
						isOnLeft("messageContainer"),
					]}
				>
					<View style={styles.messageView}>
						<Text style={[styles.message, isOnLeft("message")]}>
							{message}
						</Text>
					</View>
					<View style={styles.timeView}>
						<Text style={[styles.time, isOnLeft("time")]}>
							{convertStringToDate(time)}
						</Text>

					</View>
				</View>
			</Animated.View>
		</FlingGestureHandler>
	);
};

const styles = StyleSheet.create({
	container: {
		paddingVertical: 10,
		marginVertical: 5,
	},
	messageContainer: {
		backgroundColor: "#f0f0f0",
		maxWidth: "80%",
		alignSelf: "flex-end",
		flexDirection: "row",
		borderRadius: 15,
		paddingHorizontal: 10,
		marginHorizontal: 10,
		paddingTop: 5,
		paddingBottom: 10,
	},
	messageView: {
		backgroundColor: "transparent",
		maxWidth: "80%",
	},
	timeView: {
		backgroundColor: "transparent",
		justifyContent: "flex-end",
		paddingLeft: 10,
	},
	message: {
		color: "black",
		alignSelf: "flex-start",
		fontSize: 16,
		fontWeight: "semibold"

	},
	time: {
		color: "gray",
		alignSelf: "flex-end",
		fontSize: 10,
		fontWeight: "bold"

	},
});

export default Message;
