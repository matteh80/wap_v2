import { apiClient } from '../axios.config'
import Cookies from 'universal-cookie'

const {
  GET_PROFILE
} = require('./actionTypes/profile')

const cookies = new Cookies()

export function getProfile () {
  return (dispatch, getState) => {
    return apiClient.get('https://api.wapcard.se/api/v1/me/')
      .then((result) => {
        apiClient.defaults.headers = {
          'Authorization': 'Token ' + cookies.get('token')
        }
        return dispatch({
          type: GET_PROFILE,
          ...result.data,
          receivedAt: Date.now()
        })
      })
      .catch(function (error) {
        dispatch({
          type: GET_PROFILE,
          error: error.text,
          receivedAt: Date.now()
        })
      })
  }
}