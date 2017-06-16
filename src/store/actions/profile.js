import { apiClient } from '../axios.config'
import Cookies from 'universal-cookie'

const {
  GET_PROFILE,
  UPDATE_PROFILE
} = require('./actionTypes/profile')

const cookies = new Cookies()

export function getProfile () {
  return (dispatch, getState) => {
    return apiClient.get('me/')
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

export function updateProfile (profile) {
  return (dispatch, getState) => {
    return apiClient.post('me/', profile)
      .then((result) => {
        return dispatch({
          type: UPDATE_PROFILE,
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

export function uploadProfilePic (data) {
  return (dispatch, getState) => {
    return apiClient.post('me/picture/',
      data
    )
      .then((result) => {
        dispatch({
          type: GET_PROFILE,
          picture: result.data.size
        })
      })
      .catch(function (error) {
        console.log(error)
      })
  }
}
