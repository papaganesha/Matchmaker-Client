import { View, Text, ScrollView, ImageBackground, ActivityIndicator, TouchableOpacity } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import EditableText from 'react-native-inline-edit';
import tw from 'twrnc';
import axios from 'axios'
import * as ImagePicker from 'react-native-image-picker';
import Icon from 'react-native-vector-icons/FontAwesome'

import { BASE_URL } from '../config'

import { AuthContext } from '../context/AuthContext';


function getAge(dateString) {
  var today = new Date();
  var birthDate = new Date(dateString);
  var age = today.getFullYear() - birthDate.getFullYear();
  var m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
}

const Profile = () => {
  const { userInfo, userToken, logout, refreshUserInfo, error, setError, isLoading } = useContext(AuthContext)
  const [profileImage, setProfileImage] = useState(null)
  const [fName, setFname] = useState("")
  const [sName, setSname] = useState("")
  const [city, setCity] = useState("")
  const [summary, setSummary] = useState("")
  const [birthDate, setBirthdate] = useState("")
  const [gender, setGender] = useState("")
  const [sexOrientation, setOrientation] = useState("")
  const [interests, setInterests] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(()=>{
    setError("")
  },[])

  useEffect(() => {
    if (userInfo) {
      setFname(userInfo.fName)
      setSname(userInfo.sName)
      setBirthdate(userInfo.birthDate)
      setCity(userInfo.city)
      setSummary(userInfo.summary ? userInfo.summary : "")
      setGender(userInfo.gender)
      setOrientation(userInfo.sexOrientation)
      setInterests(userInfo.interests)
    }
    setError("")
  }, [userInfo])

  // useEffect(() => {
  // }, [setProfileImage])


  const openImageLibrary = () => {
    let options = {
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };
    ImagePicker.showImagePicker(options, (response) => {
      console.log('Response = ', response);
    
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        const source = { uri: response.uri };
        console.log(source)
        // You can also display the image using data:
        // const source = { uri: 'data:image/jpeg;base64,' + response.data };
    
        // this.setState({
        //  filePath: response,
        //  fileData: response.data,
        //  fileUri: response.uri
        // });
      }
  })
}

  const openImageLibraryAvatar = async () => {
    setLoading(true)
    setError("")
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== 'granted') {
        alert('Sorry, we need camera roll permissions to make this work!');
    }

    if (status === 'granted') {
        const response = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
        });

        if (!response.cancelled) {
            //setProfileImage(response.uri)
            uploadProfileImage()

        } else {
            setError("Algo ocorreu durante a escolha, tente novamente")
        }
    }
    setLoading(false)
};

const uploadProfileImage = async () => {
  setLoading(true)

    const formData = new FormData();
    formData.append('profile', {
        name: new Date() + '_profile',
        uri: profileImage,
        type: 'image/jpg',
    });

    await axios.post(`${BASE_URL}uploadAvatar`, formData, {
        headers: {
            Authorization: `${userToken}`,
            Accept: 'application/json',
            'Content-Type': 'multipart/form-data',
        },
    }).then(res => {
        if (res.data.success) {
            if (profileImage) {
                console.log("Upload feito com sucesso")
                refreshUserInfo()
                //setError("Upload feito com sucesso")

            }
        }
    }).catch(err => {
        console.log("ERR ", err.response.data);
        setError("Faça upload novamente")
    });
    setLoading(false)

}


  const changeFname = async (name) => {
    setError("")
    axios.put(`${BASE_URL}user`, {
      fName: name,
    }, {
      headers: {
        'Authorization': `${userToken}`
      }
    }).then(res => {
      if (res.data.success) {
        refreshUserInfo()
      }
    })
      .catch(err => {
        setError(err.response.data.error)
      })
  }

  const changeSname = async (name) => {
    setError("")
    axios.put(`${BASE_URL}user`, {
      sName: name,
    }, {
      headers: {
        'Authorization': `${userToken}`
      }
    }).then(res => {
      if (res.data.success) {
        refreshUserInfo()
      }
    })
      .catch(err => {
        setError(err.response.data.error)
      })

  }

  const changeCity = async (city) => {
    setError("")
        axios.put(`${BASE_URL}user`, {
      city,
    }, {
      headers: {
        'Authorization': `${userToken}`
      }
    }).then(res => {
      if (res.data.success) {
        refreshUserInfo()
      }
    })
      .catch(err => {
        setError(err.response.data.error)
      })
  }

  const changeSummary = async (summary) => {
    setError("")
    axios.put(`${BASE_URL}user`, {
      summary,
    }, {
      headers: {
        'Authorization': `${userToken}`
      }
    }).then(res => {
      if (res.data.success) {
        refreshUserInfo()
      }
    })
      .catch(err => {
        setError(err.response.data.error)
      })
  }

  const returnUserGender = () => {
    if (userInfo.gender == 0) {
      return "Homem"
    }
    if (userInfo.gender == 1) {
      return "Mulher"
    }
    if (userInfo.gender == 2) {
      return "Transexual Homem"
    }
    if (userInfo.gender == 3) {
      return "Transexual Mulher"
    }
  }

  const changeGender = async (gender) => {
    setError("")
    //PEGA GENERO DO USUARIO ATUAL
    let userGender = returnUserGender()

    //SETA VARIAVEL PARA RETORNO
    let option

    //CHECA SE NOVO GENERO NAO NAO E O ATUAL DO USUARIO 
    if (gender !== userGender) {
      if (["Homem", "Mulher", "Transexual Homem", "Transexual Mulher"].includes(gender)) {
        if (gender == "Homem") {
          option = 0
        }
        if (gender == "Mulher") {
          option = 1
        }
        if (gender == "Transexual Homem") {
          option = 2
        }
        if (gender == "Transexual Mulher") {
          option = 3
        }

        axios.put(`${BASE_URL}user`, {
          gender: option,
        }, {
          headers: {
            'Authorization': `${userToken}`
          }
        }).then(res => {
          if (res.data.success) {
            refreshUserInfo()
          }
        })
          .catch(err => {
            setError(err.response.data.error)
          })

      } else {
        setError("Genêro inválido")
      }
    }
  }

  const returnUserOrientation = () => {
    if (sexOrientation == 0) {
      return "Heterosexual"
    }
    if (sexOrientation == 1) {
      return "Bisexual"
    }
    if (sexOrientation == 2) {
      return "Homosexual"
    }
  }

  const changeOrientation = async (orientation) => {
    setError("")
    //PEGA ORIENTACAO ATUAL DO USUARIO
    let userOrientation = returnUserOrientation()

    //SETA VARIAVEL PARA RETORNO
    let option

    //CHECA SE NOVA ORIENTACAO NAO E A ATUAL DO USUARIO
    if (orientation !== userOrientation) {
      if (["Heterosexual", "Bisexual", "Homosexual"].includes(orientation)) {
        if (orientation == "Heterosexual") {
          option = 0
        }
        if (orientation == "Bisexual") {
          option = 1
        }
        if (orientation == "Homosexual") {
          option = 2
        }

        axios.put(`${BASE_URL}user`, {
          sexOrientation: option,
        }, {
          headers: {
            'Authorization': `${userToken}`
          }
        }).then(res => {
          if (res.data.success) {
            refreshUserInfo()
          }
        })
          .catch(err => {
            setError(err.response.data.error)
          })
      } else {
        setError("Orientação inválida")
      }

    }
  }

  const RenderPictures = () => {
    if (userInfo.mainPicture) {
      const mainPicture = userInfo.mainPicture
      return (
        <View style={tw`flex w-full h-full rounded`}>
          {!loading ? (
            <ImageBackground imageStyle={tw`rounded`} style={tw`flex w-full h-full`} source={{ uri: mainPicture }} >
              <View style={tw`flex w-full h-full rounded justify-end items-end`}>
                <TouchableOpacity
                  onPress={openImageLibrary}
                  style={tw`bg-transparent`}
                >
                  <Icon name="camera" size={30} color="white" style={tw`mr-4 mb-4`} />
                </TouchableOpacity>
              </View>
            </ImageBackground>

          ) : (
            <View style={tw`flex w-full h-full rounded justify-center center border`}>
              <ActivityIndicator size={30} color="black" />
            </View>

          )}
        </View>

      )
    } else {
      return (
        <View style={tw`flex w-full h-full rounded border`}>
          <View style={tw`flex w-full h-full rounded justify-end items-end`}>
            {!loading ? (
              <TouchableOpacity
                onPress={openImageLibraryAvatar}
                style={tw`bg-transparent`}
              >
                <Icon name="camera" size={30} color="black" style={tw`mr-4 mb-4`} />
              </TouchableOpacity>
            ) : (
              <View style={tw`flex w-full h-full rounded justify-end items-end`}>
                <ActivityIndicator size={30} color="black" />
              </View>
            )}
          </View>
        </View>

      )
    }
  }

  const RenderNamesAndAge = () => {
    return (
      <View style={tw`flex w-full items-start flex-row pt-5 `}>
        <EditableText
          style={tw`ml-8 mr-1 text-2xl font-semibold`}
          text={fName}
          sendText={(text) => changeFname(text)}
          loading={isLoading}
          isTextEditable={true}
        />
        <EditableText
          style={tw`text-2xl font-semibold`}
          text={sName}
          sendText={(text) => changeSname(text)}
          loading={isLoading}
          isTextEditable={true}
        />
        <Text style={tw`text-2xl font-semibold`}>, {isLoading ? (<ActivityIndicator size={20} color="#FF0D" />) : (getAge(birthDate))}</Text>
      </View>
    )
  }

  const RenderGenderAndOrientation = () => {
    let returnG = ""
    let returnO = ""
    if (gender == 0) {
      returnG = "Homem"
    }
    if (gender == 1) {
      returnG = "Mulher"
    }
    if (gender == 2) {
      returnG = "Transexual"
    }
    if (sexOrientation == 0) {
      returnO = "Heterosexual"
    }
    if (sexOrientation == 1) {
      returnO = "Bisexual"
    }
    if (sexOrientation == 2) {
      returnO = "Homosexual"
    }
    return (
      <View style={tw`flex w-full h-10 items-center flex-row `}>
        <EditableText
          style={tw`ml-8 font-semibold`}
          text={returnG}
          sendText={(text) => changeGender(text)}
          loading={isLoading}
          isTextEditable={true}
        />
        <EditableText
          style={tw`ml-1 font-semibold`}
          text={returnO}
          sendText={(text) => changeOrientation(text)}
          loading={isLoading}
          isTextEditable={true}
        />
      </View>
    )
  }


  const RenderCity = () => {
    return (
      <View style={tw`mt-4  w-full  pt-2 pb-3`}>
        <Text style={tw`mt-2 ml-8 text-base font-bold`}>Cidade</Text>
        <EditableText
          style={tw`mt-2 ml-8 h-9 font-medium`}
          text={city}
          sendText={(text) => changeCity(text)}
          loading={isLoading}
          isTextEditable={true}
        />
      </View>
    )
  }

  const RenderSummary = () => {
    return (
      <View style={tw`flex w-full h-48`}>
        <Text style={tw`mt-3 ml-8 text-base font-bold`}>Sobre</Text>
        <View style={tw` mx-8 rounded-lg border-white h-30 px-4 mt-3 bg-red-600`}>
          <EditableText
            style={tw`mt-3 font-medium text-white`}
            text={summary}
            sendText={(text) => changeSummary(text)}
            loading={isLoading}
            isTextEditable={true}
          />
        </View>
        <View style={tw`w-full items-end pr-9 pt-1`}>
          <Text>{summary.length}/400</Text>
        </View>
      </View>
    )
  }

  const RenderInterests = () => {
    if (interests) {
      return (
        <View style={tw`flex w-full h-auto`}>
          <Text style={tw`mt-3 ml-8 text-lg font-bold`}>Interesses</Text>
          <View style={tw`flex w-full flex-row flex-wrap font-bold justify-start px-6 pt-4`}>
            {interests.map(interest => {
              return (
                <View style={tw`flex flex-row border-white rounded-lg ml-3 mb-3 bg-red-600`} key={interest.interestName}>
                  <View style={tw`flex justify-center items-center w-14`}>
                    <Icon name={interest.iconName} style={tw``} size={18} color="white" />
                  </View>
                  <View style={tw`flex justify-center items-start h-10 w-24`}>
                    <Text style={tw`font-bold ml-1 text-white`}>{interest.interestName}</Text>
                  </View>
                </View>
              )
            })}
          </View>
        </View>
      )
    }
  }


  return (
    <View style={tw`flex-1 items-end w-full`}>
      <ScrollView style={tw`flex-1 w-full`}>
        <View style={tw`flex items-center w-full h-100 justify-center`}>
          <RenderPictures />
        </View>
        {!!error && <Text style={tw`flex w-85 mt-8 text-center text-base font-semibold border rounded-lg p-1 self-center`}>{error}</Text>}

        <View style={tw`flex items-start w-full rounded`}>

          <RenderNamesAndAge />

          <RenderGenderAndOrientation />
          <RenderCity />


          <View style={tw`flex w-full mt-4`}>
            <RenderSummary />
          </View>


          <View style={tw`flex w-full`}>
            <RenderInterests />
          </View>

          <View style={tw`flex w-full items-end mt-7 mb-6 px-7 `}>
            <TouchableOpacity
              style={tw`flex w-25 h-10 border-white justify-center items-center rounded-lg mx-2 flex-row pr-2 bg-red-600`}
              onPress={() => {
                console.log("loggout click")
                logout()
              }}
            >

              <View style={tw`w-2/4 items-end`}>
                <Text style={tw`font-semibold text-white`}>Sair</Text>
              </View>

              <View style={tw`flex w-2/4 items-end`}>
                <Icon name="sign-out" style={tw`w-2/4`} size={20} color="white" />
              </View>

            </TouchableOpacity>
          </View>

        </View>
      </ScrollView>
    </View>
  )
}



export default Profile