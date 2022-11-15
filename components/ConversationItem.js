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
		marginTop: 18,
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
		marginLeft: 13,
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
	const navigation = useNavigation();
	//const [date, setDate] = useState([])
	const [loading, setLoading] = useState(false)

	function convertStringToDate(strTime) {
		setLoading(true)
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
		setLoading(false)
		return [datestr, timestr]
	}
	

	useEffect(() => {	
		returnLastMessage(user)
	}, [])



		return (
			<View style={tw`flex-1`} key={user._id}>
				<TouchableOpacity style={[styles.conversation, tw`border my-2 rounded pr-4`]}
					onPress={() => navigation.navigate('MessagesScreen', {
						user: user
					})}>
					<View style={[styles.imageContainer, tw` `]}>
						<Image style={styles.image} source={user.mainPicture ? { uri: user.mainPicture } : require("../assets/placeholder1.jpg")} />
					</View>
					<View style={tw`flex-1 justify-center`}>
						<View style={tw`flex flex-row justify-around`}>
							<Text numerOfLine={1} style={tw`mt-5 text-lg text-black w-40 font-semibold`}>{username}</Text>
							{loading == false ? (
								<Text style={tw`mt-7 text-xs text-black font-semibold`}>{convertStringToDate(time)[1]} {convertStringToDate(time)[0]}</Text>
							) : (
								<ActivityIndicator color="black" size={10} style={tw`mt-`} />
							)}
						</View>
						<View style={tw`flex flex-row justify-between`}>
							<Text style={tw`text-black text-sm w-full color-gray-300 font-semi`}>{lastMessage}</Text>
						</View>
					</View>	
				</TouchableOpacity>
	
			</View>
		)

}


export default ConversationItem