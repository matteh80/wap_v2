import axios from 'axios'
import Cookies from 'universal-cookie'
import { apiClient } from '../axios.config'

const {
  LOGIN,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT
} = require('./actionTypes/auth')

const cookies = new Cookies()

export function login (creds) {
  return (dispatch, getState) => {
    dispatch({
      type: LOGIN
    })
    return axios.post('https://api.wapcard.se/api/v1/token/',
      creds
    )
      .then((result) => {
        cookies.set('token', result.data.token, { path: '/' })
        apiClient.defaults.headers = {
          'Authorization': 'Token ' + cookies.get('token')
        }
        return dispatch({
          type: LOGIN_SUCCESS,
          ...result.data,
          receivedAt: Date.now()
        })
      })
  }
}

export function logout () {
  return (dispatch, getState) => {
    dispatch({
      type: LOGOUT
    })
  }
}

export function socialLogin (data) {
  return dispatch => {
    // We dispatch requestLogin to kickoff the call to the API
    // dispatch(requestLogin(creds))
    console.log(data)
    return axios.post('https://api.wapcard.se/api/v1/login/social/token/', data)
      .catch(function (error) {
        if (error.response) {
          // The request was made, but the server responded with a status code
          // that falls out of the range of 2xx
          console.log(error.response.data)
          console.log(error.response.status)
          console.log(error.response.headers)
          return dispatch(loginError(error.response.data))
        } else {
          // Something happened in setting up the request that triggered an Error
          console.log('Error', error.message)
        }
        console.log(error.config)
      })

      .then((result) => {
        console.log('login')
        console.log(result)

        // If login was successful, set the token in local storage
        cookies.set('token', result.data.token, { path: '/' })
        apiClient.defaults.headers = {
          'Authorization': 'Token ' + cookies.get('token')
        }
        // Dispatch the success action
        dispatch(receiveLogin(result.data.token))
      })
  }
}

function loginError (message) {
  return {
    type: LOGIN_FAIL,
    isFetching: false,
    isAuthenticated: false,
    message
  }
}

function receiveLogin (token) {
  return {
    type: LOGIN_SUCCESS,
    token: token,
    receivedAt: Date.now()
  }
}
