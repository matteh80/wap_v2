import { apiClient } from '../axios.config'

const {
  EMPLOYMENTS_FAIL,
  GET_ALL_EMPLOYMENTS,
  CREATE_EMPLOYMENT
} = require('./actionTypes/employments')

export function getAllEmployments () {
  return (dispatch, getState) => {
    return apiClient.get('me/employments').then((result) => {
      return dispatch({
        type: GET_ALL_EMPLOYMENTS,
        employments: result.data,
        receivedAt: Date.now()
      })
    })
      .catch(function (error) {
        return dispatch({
          type: EMPLOYMENTS_FAIL,
          error: error.text,
          receivedAt: Date.now()
        })
      })
  }
}

export function createEmployment (employment) {
  return (dispatch, getState) => {
    return apiClient.post('me/employments/',
      employment
    ).then((result) => {
      return dispatch({
        type: CREATE_EMPLOYMENT,
        employment: result.data,
        receivedAt: Date.now()
      })
    })
      .catch(function (error) {
        return dispatch({
          type: EMPLOYMENTS_FAIL,
          error: error.text,
          receivedAt: Date.now()
        })
      })
  }
}
