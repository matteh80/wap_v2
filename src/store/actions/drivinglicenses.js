import { apiClient } from '../axios.config'

const {
  GET_ALL_LICENSES,
  GET_MY_LICENSES,
  SAVE_LICENSES_TO_SERVER,
  LICENSES_FAIL
} = require('./actionTypes/drivinglicenses')

export function getAllLicenses () {
  return (dispatch, getState) => {
    return apiClient.get('driving-licenses').then((result) => {
      return dispatch({
        type: GET_ALL_LICENSES,
        licenses: result.data,
        receivedAt: Date.now()
      })
    })
      .catch(function (error) {
        return dispatch({
          type: LICENSES_FAIL,
          error: error.text,
          receivedAt: Date.now()
        })
      })
  }
}

export function getMyLicenses () {
  return (dispatch, getState) => {
    return apiClient.get('me/driving-licenses').then((result) => {
      return dispatch({
        type: GET_MY_LICENSES,
        userLicenses: result.data,
        receivedAt: Date.now()
      })
    })
      .catch(function (error) {
        return dispatch({
          type: LICENSES_FAIL,
          error: error.text,
          receivedAt: Date.now()
        })
      })
  }
}
