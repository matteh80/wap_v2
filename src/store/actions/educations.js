import { apiClient } from '../axios.config'

const {
  EDUCATIONS_FAIL,
  GET_ALL_EDUCATIONS,
  CREATE_EDUCATION
} = require('./actionTypes/educations')

export function getAllEducations () {
  return (dispatch, getState) => {
    return apiClient.get('me/educations').then((result) => {
      console.log(result)
      return dispatch({
        type: GET_ALL_EDUCATIONS,
        educations: result.data,
        receivedAt: Date.now()
      })
    })
      .catch(function (error) {
        return dispatch({
          type: EDUCATIONS_FAIL,
          error: error.text,
          receivedAt: Date.now()
        })
      })
  }
}

export function createEducation (education) {
  return (dispatch, getState) => {
    return apiClient.post('me/educations/',
      education
    ).then((result) => {
      console.log(result)
      return dispatch({
        type: CREATE_EDUCATION,
        education: result.data,
        receivedAt: Date.now()
      })
    })
      .catch(function (error) {
        return dispatch({
          type: EDUCATIONS_FAIL,
          error: error.text,
          receivedAt: Date.now()
        })
      })
  }
}
