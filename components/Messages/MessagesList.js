import React, { useRef, useContext } from "react";
import { ScrollView } from "react-native";
import { View, Text } from "react-native";
import tw from 'twrnc';

import { AuthContext } from "../../context/AuthContext";

import Message from "./Message";

const MessagesList = ({ onSwipeToReply, user, messages }) => {
	const { userInfo } = useContext(AuthContext)

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