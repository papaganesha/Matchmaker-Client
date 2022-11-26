import { View, Text, Image, StyleSheet } from 'react-native'
import React from 'react'
import tw from 'twrnc';
import slides from './slides'
import AppIntroSlider from 'react-native-app-intro-slider';


const FirstScreenSlider = () => {
  function renderSlides({ item }) {
    return (
      <View style={tw`flex w-full h-full pt-10 items-center bg-white`}>
        <Image
          source={item.image}
          style={styles.image}
        />
        <Text style={styles.title}>
          {item.title}
        </Text>
        <Text style={styles.description}>{item.description}</Text>
      </View>
    )
  }


  return (
    <AppIntroSlider
      renderItem={renderSlides}
      data={slides}
      showNextButton={false}
      showDoneButton={false}
      activeDotStyle={{
        backgroundColor: 'red',
        width: 30,
      }}
    />
  )

}


const styles = StyleSheet.create({
  image: {
    resizeMode: 'cover',
    height: '60%',
    width: '85%',
    borderRadius: 10,
  },
  title: {
    paddingTop: 18,
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
    textAlign: 'center',
  },
  description: {
    textAlign: 'center',
    color: 'black',
    paddingHorizontal: 28,
    paddingVertical:0,
    marginTop: 28,
    marginBottom: 0,
    fontSize: 14,
  },

})

export default FirstScreenSlider