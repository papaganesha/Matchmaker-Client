import React from 'react';
import tw from 'twrnc';
import { View } from 'react-native'

import { Container, RoundButton, IconX, IconHeart } from './styles';

export default function Footer({ handleLike, handleNo }) {
  return (
    <View style={tw`flex w-full h-2/12 flex-row justify-center pt-4`}>
      <RoundButton onPress={handleNo}>
        <IconX />
      </RoundButton>
      <RoundButton onPress={handleLike}>
        <IconHeart />
      </RoundButton>
    </View>
  );
}
