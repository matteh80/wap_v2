import { apiClient } from '../axios.config'

const {
  EDUCATIONS_FAIL,
  GET_ALL_EDUCATIONS,
  CREATE_EDUCATION,
  UPDATE_EDUCATION,
  REMOVE_EDUCATION
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

export function updateEducation (education) {
  return dispatch => {
    return apiClient.put('me/educations/' + education.id + '/',
      education
    )
      .then((result) => {
        return dispatch({
          type: UPDATE_EDUCATION,
          education: result.data,
        })
      })
      .catch(function (error) {
        console.log(error)
      })
  }
}

export function removeEducation (education) {
  return dispatch => {
    return apiClient.delete('me/educations/' + education.id + '/',
      education
    )
      .then((result) => {
        return dispatch({
          type: REMOVE_EDUCATION,
          id: education.id
        })
      })
      .catch(function (error) {
        console.log(error)
      })
  }
}
