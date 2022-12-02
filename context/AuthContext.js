import React, { createContext, useState, useEffect, useRef } from "react"
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios'

import { BASE_URL } from '../config'

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const loginLoading = useRef(false);
  const registerLoading = useRef(false);
  //const [loginLoading, setLoginLoading]= useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [userToken, setUserToken] = useState(null)
  const [userInfo, setUserInfo] = useState(null)
  const [error, setError] = useState("")



  const login = (email, password) => {
    setError("")
    console.log("LOADING FIRST IS", loginLoading.current)
    loginLoading.current = true
    console.log("LOADING TRUE ", loginLoading.current)

    if (email && password) {
      axios.post(`${BASE_URL}signin`, {
        email,
        password
      })
        .then(res => {
          console.log(res)
          setUserInfo(res.data.user)
          setUserToken(res.data.token)
          setFirstLogin(res.data.firstLogin)

          AsyncStorage.setItem("userInfo", JSON.stringify(res.data.user))
          AsyncStorage.setItem("userToken", res.data.token)
          loginLoading.current = false

        })
        .catch(err => {
          loginLoading.current = false
          console.log("LOADING FALSE ", loginLoading.current)
          setError(err.response.data.error)
          //console.log("LOGIN ERROR ",error.response.data.error)
        })
    } else {
      setTimeout(()=>{
        loginLoading.current = false
        console.log("LOADING FALSE", loginLoading.current)
        setError("Todos campos devem ser preenchidos")
      },1500)
  }
}

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

  const register = async (email, password, confirmPass, birthDate) => {
    setError("")
    console.log("LOADING FIRST IS", registerLoading.current)
    registerLoading.current = true
    console.log("LOADING TRUE ", registerLoading.current)

    if (email && password && confirmPass && birthDate) {
      let userAge = getAge(birthDate)
      if (userAge >= 18) {
        if (password !== confirmPass) {
          setError("Senhas não conferem")
        } else {
          axios.post(`${BASE_URL}signup`, {
            email,
            password,
            birthDate
          })
            .then(res => {
              if (res.data.success) {
                login(email, password)
              }
            })
            .catch(err => {

              setTimeout(() => {
                registerLoading.current = false
                console.log("REGISTER ERROR ", error)
                setError(err.response.data.error)
              }, 2000)
            })

        }
      } else {
        setTimeout(() => {
          registerLoading.current = false
          console.log("LOADING FALSE", registerLoading.current)
          setError("Você deve ter 18 anos para poder se cadastrar")

        }, 2000)
      }
    } else {
      setTimeout(() => {
        registerLoading.current = false
        console.log("LOADING FALSE", registerLoading.current)
        setError("Preencha todos os campos")
      }, 2000)

    }



  }

  const logout = () => {
    setIsLoading(true)
    setUserToken(null)
    setUserInfo(null)
    AsyncStorage.removeItem("userInfo")
    AsyncStorage.removeItem("userToken")
    setIsLoading(false)
  }

  const isLoggedIn = async () => {
    setIsLoading(true)
    try {
      let userInfo = await AsyncStorage.getItem('userInfo')
      let userToken = await AsyncStorage.getItem('userToken')
      userInfo = JSON.parse(userInfo)

      if (userInfo) {
        setUserToken(userToken)
        setUserInfo(userInfo)
      }

    } catch (e) {
      console.log(`isLoggedIn error ${e}`)
      setError(e)
    }

    setIsLoading(false)
  }

  const refreshUserInfo = async () => {
    axios.get(`${BASE_URL}user`, {
      headers: {
        'Authorization': `${userToken}`
      }
    })
      .then(res => {
        if (res.data.success) {
          setUserInfo(res.data.data)
          AsyncStorage.setItem("userInfo", JSON.stringify(res.data.data))
        }
      })
      .catch(err => {
        console.log("REFRES ERROR ", error)
        setError(err.response.data.error)
      })

  }



  useEffect(() => {
    isLoggedIn();
  }, [])



  return (
    <AuthContext.Provider value={{ login, logout, loginLoading, registerLoading, isLoggedIn, isLoading, setIsLoading, userToken, userInfo, error, register, refreshUserInfo, setError }}>
      {children}
    </AuthContext.Provider>
  )
}