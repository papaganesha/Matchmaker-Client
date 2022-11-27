import React, { createContext, useState, useEffect } from "react"
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios'

import { BASE_URL } from '../config'

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

  const [isLoading, setIsLoading] = useState(false)
  const [userToken, setUserToken] = useState(null)
  const [userInfo, setUserInfo] = useState(null)

  const [error, setError] = useState("")



  const login = async (email, password, setLoading) => {
    setLoading(true)

    if (email && password) {
      axios.post(`${BASE_URL}signin`, {
        email,
        password
      })
        .then(res => {
          setUserInfo(res.data.user)
          setUserToken(res.data.token)
          setFirstLogin(res.data.firstLogin)

          AsyncStorage.setItem("userInfo", JSON.stringify(res.data.user))
          AsyncStorage.setItem("userToken", res.data.token)

          //console.log(res.data)
          //console.log("USER INFO: ", JSON.stringify(res.data.user))
        })
        .catch(err => {
          //console.log(`Login erro ${err.response.data.error}`)
          setError(err.response.data.error)
          console.log("LOGIN ERROR ",error)

        })
    } else {
      setError("Todos campos devem ser preenchidos")
    }

    setLoading(false)
  
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
    setIsLoading(true)
    if (email && password && confirmPass && birthDate) {
      let userAge = getAge(birthDate)
      console.log("userAge ",userAge)
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
              if (res.data.message) { setError(res.data.message) }
              //console.log(res.success, res.data)
              login(email, password)
              //console.log("USER TOKEN: ",res.data.token)
              //console.log("USER INFO: ", JSON.stringify(res.data.user))
            })
            .catch(err => {
              //console.log(`Login erro ${err.response.data.error}`)
              console.log("REGISTER ERROR ",error)
              setError(err.response.data.error)
            })

        }
      } else {
        setError("Você deve ter 18 anos para poder se cadastrar")
      }
    } else {
      setError("Preencha todos os campos")
    }

      setIsLoading(false)
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
    try {
      setIsLoading(true)
      let userInfo = await AsyncStorage.getItem('userInfo')
      let userToken = await AsyncStorage.getItem('userToken')
      userInfo = JSON.parse(userInfo)

      if (userInfo) {
        setUserToken(userToken)
        setUserInfo(userInfo)
      }

      setIsLoading(false)
    } catch (e) {
      console.log(`isLoggedIn error ${e}`)
      setError(e)
    }
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
        console.log("REFRES ERROR ",error)
        setError(err.response.data.error)
      })

  }



  useEffect(() => {
    isLoggedIn();
  }, [])



  return (
    <AuthContext.Provider value={{ login, logout, isLoggedIn, isLoading, setIsLoading, userToken, userInfo, error, register, refreshUserInfo, setError}}>
      {children}
    </AuthContext.Provider>
  )
}