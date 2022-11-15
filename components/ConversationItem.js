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
		marginRight: 15,
		marginTop: 20,
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
		marginTop: 16,
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
		fontWeight: 'semibold'

	},
	time: {
		marginTop: 18,
		marginRight: 10,
		fontSize: 11,
		color: "black",
		fontWeight: 'semibold'
	},

})


const ConversationItem = ({ user, lastMessage, time, username, returnLastMessage }) => {
	console.log("CVITEM")
	const navigation = useNavigation();

	useEffect(()=>{
		
	},[])

	return (
		<View style={tw`flex w-full`} key={user._id}>
			<TouchableOpacity style={[styles.conversation, tw`border border-gray-500 my-2 rounded pr-4`]}
				onPress={() => navigation.navigate('MessagesScreen', {
					user: user
				})}>
				<View style={[styles.imageContainer, tw``]}>
					<Image style={styles.image} source={user.mainPicture ? { uri: user.mainPicture } : require("../assets/placeholder1.jpg")} />
				</View>
				<View style={tw`flex-1 justify-center`}>
					<View style={tw`flex flex-row justify-between`}>
						<Text numerOfLine={1} style={tw`mt-5 text-lg text-black w-40 font-semibold`}>{username}</Text>

						<Text style={tw`mt-6 text-xs text-black font-semibold`}>{time}</Text>

					</View>
					<View style={tw`flex flex-row justify-between`}>
						<Text style={tw`text-black text-sm w-full font-semi`}>{lastMessage}</Text>
					</View>
				</View>
			</TouchableOpacity>

		</View>
	)

}


export default ConversationItem