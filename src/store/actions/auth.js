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
      .catch(function (error) {
        return dispatch({
          type: LOGIN_FAIL,
          error: error.text,
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
