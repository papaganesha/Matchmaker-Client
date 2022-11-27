import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, Image, Modal, ActivityIndicator } from 'react-native'
import { useNavigation } from '@react-navigation/native';
import tw from 'twrnc';

const styles = StyleSheet.create({

	conversation: {
		flexDirection: 'row',
		paddingBottom: 20,
		paddingRight: 20,
		paddingLeft: 10,
	},
	imageContainer: {
		marginTop: 15,

		marginRight: 15,
		borderRadius: 25,
		height: 50,
		width: 50,
		overflow: 'hidden',
		alignItems: 'center',
		justifyContent: 'center',
		alignSelf: 'center',
	},
	image: {
		height: 55,
		width: 55
	},
	username: {
		marginTop: 15,
		marginLeft: 10,
		fontSize: 17,
		color: "black",
		width: 210,
		fontWeight: 'semibold'
	},
	message: {
		fontSize: 13,
		width: 240,
		color: "gray",
		marginTop: 2,
		paddingBottom: 5,
	},
	time: {
		marginTop: 18,
		marginRight: 10,
		fontSize: 11,
		color: "black",
		fontWeight: 'semibold'
	},
	notificationCircle: { 
		backgroundColor: "red",
		borderRadius: 50,
		borderWidth: 2, 
		borderColor:"white",
		height: 20,
		width: 20,
		alignItems: 'center',
		justifyContent: 'center'
	},
	notification: {
		color: "white",
		fontWeight: 'bold',
		fontSize: 10
	}

})





const ConversationItem = ({ user, lastMessage, time, username, returnLastMessage, unreadMessages, loading }) => {
	const navigation = useNavigation();

	const showNotification = (type) => {
		if (unreadMessages.length > 0 && type === "number") {
			return (
				<View style={styles.notificationCircle}>
					<Text style={styles.notification}>{unreadMessages.length}</Text>
				</View>
			);
		} else if (unreadMessages.length > 0 && type === "imageCircle") {
			return {
				borderColor: "green"
			}
		}
	};

	return (
		<View style={tw`flex w-full `} key={user._id}>
			<TouchableOpacity style={tw`flex flex-row pb-4 pr-4 pl-3 border border-white my-2 rounded-lg bg-red-600`}
				onPress={() => navigation.navigate('MessagesScreen', {
					user: user,
				})}>
				<View style={[styles.imageContainer, tw`shadow-lg`]}>
					<Image style={styles.image} source={user.mainPicture ? { uri: user.mainPicture } : require("../assets/placeholder1.jpg")} />
				</View>
				<View style={tw`flex-1 justify-center`}>
					<View style={tw`flex flex-row justify-between`}>
						<Text numerOfLine={1} style={tw`mt-4 text-lg text-white w-40 font-semibold`}>{username}</Text>
						{time ? (
							<Text style={tw`mt-6 text-xs text-white font-semibold`}>{time}</Text>
						) : (
							<ActivityIndicator size={15} color="white" style={tw`mt-6`}/>
						)}

					</View>
					<View style={tw`flex flex-row justify-around`}>
						
						<View style={tw`flex w-3/4`}>
						{lastMessage ? (
							<Text style={tw`text-white text-sm w-full mb-1`}>{lastMessage}</Text>
						) : (
							<ActivityIndicator size={15} color="white" style={tw`mt-2`}/>		
						)}
						</View>

						<View style={tw`flex w-1/4 items-end`}>
						{!loading ? (showNotification('number')) : (
							<ActivityIndicator size={15} color="white" style={tw`mt-2`}/>
						)}
						</View>


	
			
					</View>
				</View>
			</TouchableOpacity>

		</View>
	)

}


export default ConversationItem