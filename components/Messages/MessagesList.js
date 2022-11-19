import React, { useRef, useContext } from "react";
import { ScrollView } from "react-native";
import { View, Text } from "react-native";
import tw from 'twrnc';

import { AuthContext } from "../../context/AuthContext";

import Message from "./Message";

const MessagesList = ({ onSwipeToReply, user, messages }) => {
	const { userInfo } = useContext(AuthContext)

	const LoggedUser = useRef(userInfo._id);
	const scrollViewRef = useRef(null);

	function scrollViewSizeChanged(height){
		// y since we want to scroll vertically, use x and the width-value if you want to scroll horizontally
		scrollViewRef.current?.scrollTo({y: height, animated: true}); 
	 }

	// useEffect(() => { 
	// 	returnAllConversation() 
	// }, [])

	return (
		<ScrollView style={{ backgroundColor: "white", flex: 1 }}
		ref={scrollViewRef} onContentSizeChange={(width,height) => {scrollViewSizeChanged(height)}}>
			{messages.length > 0 ? messages.map((message, index) => {
				return(
					<Message
					key={index}
					messageId={message.id}
					receiverId={message.receiver.uid}
					senderId={message.sender.uid}
					time={message.sentAt}
					isLeft={message.sender.uid !== LoggedUser.current}
					message={message.text}
					onSwipe={onSwipeToReply}
					deliveredAt={message.deliveredAt}
					readAt={message.readAt}
				/>
				)
			}
				
			):(
				<View style={tw`w-full items-center h-24 justify-center`}> 
					<Text  style={tw`px-8 py-2 text-base border border-gray-500 bg-gray-200 rounded`}>Mande a primeira mensagem</Text>
				</View>
			)}
		</ScrollView>
	);
};

export default MessagesList