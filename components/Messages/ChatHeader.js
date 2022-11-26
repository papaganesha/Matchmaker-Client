import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";


const ChatHeader = ({ username, bio, picture, onlineStatus, onPress }) => {
	const navigation = useNavigation();
	return (
		<View style={styles.container}>
			<View style={styles.profileOptions}>
				<TouchableOpacity style={styles.profile}  onPress={onPress}>
					<Image style={styles.image} source={{ uri: picture }} />
					<View style={styles.usernameAndOnlineStatus}>
						<Text style={styles.username}>{username}</Text>
					</View>
				</TouchableOpacity>

			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flexDirection: "row",
		backgroundColor: "#DC2626",
		paddingTop: 12,
		paddingBottom: 12,
		borderBottomWidth: 2, 
		borderBottomColor: "white",
	},
	backButton: {
		alignSelf: "center",
		paddingHorizontal: 10,
	},
	profileOptions: {
		flex: 1,
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		paddingHorizontal: 10,
	},
	profile: {
		flexDirection: "row",
		alignItems: "center",
		borderColor: "#fff",
		flex: 4,
		paddingHorizontal: 13
	},
	image: {
		height: 55,
		width: 55,
		borderRadius: 32.5,
	},
	usernameAndOnlineStatus: {
		flexDirection: "column",
		justifyContent: "center",
		paddingHorizontal: 10,
	},
	username: {
		color: "white",
		fontSize: 20,
		fontWeight: "bold",
	},
	onlineStatus: {
		color: "white",
		fontSize: 16,
	},
	options: {
		flex: 1,
		flexDirection: "row",
		justifyContent: "flex-end",
		alignItems: "center",
	},
});

export default ChatHeader;