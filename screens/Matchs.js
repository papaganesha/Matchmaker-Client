import { View, Text } from 'react-native'
import React, { useState, useContext, useEffect } from 'react'

import { AuthContext } from '../context/AuthContext';

import { CometChat } from '@cometchat-pro/react-native-chat';



const Matchs = () => {
    const { userInfo, userToken } = useContext(AuthContext)
    const [usersInfo, setUsersInfo] = useState([])
    const [user, setUser] = useState("")
    const [error, setError] = useState("")

    const appID = '22363314d6b05de2';
    const region = 'us';
    const authKey = 'cefa05028acbf59fc97a08e61ad0f14765251514';
    const uid = userInfo._id;
    const name = `${userInfo.fName} ${userInfo.sName}`

    let newUser = new CometChat.User(uid);

    newUser.setName(name);

    const appSetting = new CometChat.AppSettingsBuilder()
        .subscribePresenceForAllUsers()
        .setRegion(region)
        .build();
    CometChat.init(appID, appSetting).then(
        () => {
            console.log('Initialization completed successfully');
            // You can now call login function.
        },
        (error) => {
            console.log('Initialization failed with error:', error);
            // Check the reason for error and take appropriate action.
        },
    );

    const getUsers = async () => {
        axios.get(`${BASE_URL}users`, {
          headers: {
            'Authorization': `${userToken}`
          }
        }).then(res => {
          setUsersInfo(res.data.data)
        })
          .catch(err => {
            console.log("GET USERS ERROR: ", err)
          })
      }
    
    
      useEffect(() => {
        getUsers()
      }, [])    


    if (!user) {
        CometChat.createUser(newUser, authKey).then(
            user => {
                console.log("user created", user);
            }, error => {
                if(error.code !== "ERR_UID_ALREADY_EXISTS"){
                    console.log("error", error);
                }
            }
        )


        CometChat.login(uid, authKey).then(
            (user) => {
                console.log('Login Successful:', { user });
                setUser(user)
            },
            (error) => {
                console.log('Login failed with exception:', { error });
                setError(error)
            },
        );
    }


    return (
        <View>
            {user ? (<Text>{user.name}</Text>) : (<Text>{error.code}: {error.message}</Text>)}
        </View>
    )
}

export default Matchs