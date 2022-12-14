import React, { useState } from 'react';
import { View, Text, TouchableHighlight} from 'react-native';
import styles from './styles';
import tw from 'twrnc';
import Icon from 'react-native-vector-icons/FontAwesome'


export default function RadioButton({ data, onSelect }) {
  const [userOption, setUserOption] = useState(null);
  const selectHandler = (value) => {
    onSelect(value);
    setUserOption(value);
  };
  return (
    <View style={tw`w-full items-center px-2 `}>
      {data.map((item) => {
        return (
          <TouchableHighlight 
            style={item.value === userOption ? tw`mb-6 border border-white rounded-lg bg-red-600 ` : tw`mb-6 border rounded-lg` }
            onPress={() => selectHandler(item.value)}
            key={item.key}
            >
           <View style={tw`flex-row w-11/12 p-3`}>
                <View style={tw`w-4/6 items-start`}>
                    <Text style={item.value === userOption ? tw`text-white font-semibold text-lg` : tw`text-black text-lg font-semibold` }> {item.value}</Text>
                </View>
                <View style={tw`w-2/6 items-end justify-center `}>
                    <Icon name="check" size={18} color={item.value === userOption ? "white" : "black"}/>
                </View>
           </View>
          </TouchableHighlight>
        );
      })}
    </View>
  );
}