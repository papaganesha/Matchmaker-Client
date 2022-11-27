import { View, Text, Image } from 'react-native'
import React, { useContext } from 'react'
import tw from 'twrnc';
import { AuthContext } from '../context/AuthContext';
import { useNavigation, CommonActions} from '@react-navigation/native';


const EnableNotifications = () => {
  const image = require('../assets/notificationPic.png')
  const {isLoading} = useContext(AuthContext)
  const navigation = useNavigation()

  return (
    <View style={tw`flex-1 w-full h-full bg-white`}>
      <View style={tw`flex-1 justify-end w-full h-8/12`}>
        <Image source={image} style={tw`w-full h-4/6 border`}/>
      </View>
      <View style={tw`flex-1 w-full h-2/12 items-center`}>
        <View style={tw`mt-10`}>
          <Text style={tw`pt-4 text-xl font-bold text-black text-center mt-4`}>Permitir notificações</Text>
        </View>
        <View style={tw`mt-8 mb-12 w-full text-sm font-bold`}>
          <Text style={tw`px-2 text-center`}>Receber notificações quando fizer match ou receber mensagem</Text>    
        </View>
          
        <View style={tw`mt-12 w-full items-center`}>
          <Text style={tw`bg-blue-800 hover:bg-red-400 text-black font-bold py-2 px-34 border-b-4 border-blue-700 hover:border-blue-500 rounded`}
          onPress={() => {navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [
                { name: 'Home' },
              ],
            })
          )}}
          >Permitir</Text>
        </View>
      </View>
    
  </View>
  )
}

export default EnableNotifications