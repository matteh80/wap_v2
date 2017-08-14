import { apiClient } from '../axios.config'

const {
  GET_TEST_STATUS,
} = require('./actionTypes/talentq')

export function getTestStatus () {
  return (dispatch, getState) => {
    return apiClient.get('https://api.wapcard.se/api/v1/me/assessment/')
      .catch(function (error) {
        console.log(error)
      })
      .then((result) => {
        console.log(result)
        return dispatch({
          type: GET_TEST_STATUS,
          teststatus: result.data,
        })
      })
  }
}

export function initiateTest (lang) {
  return dispatch => {
    return apiClient.post('https://api.wapcard.se/api/v1/me/assessment/',
      null
    )
      .catch(function (error) {
        console.log(error)
      })
      .then((result) => {
        return dispatch({
          type: GET_TEST_STATUS,
          teststatus: result.data,
        })
      })
  }
}
