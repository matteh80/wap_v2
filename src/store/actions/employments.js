import { apiClient } from '../axios.config'

const {
  EMPLOYMENTS_FAIL,
  GET_ALL_EMPLOYMENTS,
  CREATE_EMPLOYMENT,
  UPDATE_EMPLOYMENT,
  REMOVE_EMPLOYMENT
} = require('./actionTypes/employments')

export function getAllEmployments () {
  return (dispatch, getState) => {
    return apiClient.get('me/employments/').then((result) => {
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

export function updateEmployment (employment) {
  let mEmployment = {
    'title': employment.title,
    'employer': employment.employer,
    'occupation': employment.occupation,
    'start_date': employment.start_date,
    'end_date': employment.end_date,
    'description': employment.description,
    'current': employment.current,
    'public': employment.public,
    'updating': true
  }
  return dispatch => {
    return apiClient.put('me/employments/' + employment.id + '/',
      mEmployment
    )
      .then((result) => {
        return dispatch({
          type: UPDATE_EMPLOYMENT,
          employment: result.data,
        })
      })
      .catch(function (error) {
        console.log(error)
      })
  }
}

export function removeEmployment (employment) {
  return dispatch => {
    return dispatch({
      type: REMOVE_EMPLOYMENT,
      id: employment.id
    })
    // return apiClient.delete('me/employments/' + employment.id + '/')
    //   .then((result) => {
    //     return dispatch({
    //       type: REMOVE_EMPLOYMENT,
    //       id: employment.id
    //     })
    //   })
    //   .catch(function (error) {
    //     console.log(error)
    //   })
  }
}
