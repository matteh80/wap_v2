import { apiClient } from '../axios.config'
import { show, success, error, warning, info, hide, removeAll } from 'react-notification-system-redux'

const {
  EMPLOYMENTS_FAIL,
  GET_ALL_EMPLOYMENTS,
  CREATE_EMPLOYMENT,
  UPDATE_EMPLOYMENT,
  REMOVE_EMPLOYMENT
} = require('./actionTypes/employments')

let action

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
        error({
          // uid: 'once-please', // you can specify your own uid if required
          title: 'Fel',
          message: 'Det gick inte att hämta anställningar',
          autoDismiss: 0,
          position: 'br',
          action: {
            label: 'Försök igen',
            callback: () => getAllEmployments()
          }
        })
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
        error({
          // uid: 'once-please', // you can specify your own uid if required
          title: 'Fel',
          message: 'Det gick inte att skapa anställningen',
          autoDismiss: 0,
          position: 'br',
          action: {
            label: 'Försök igen',
            callback: () => createEmployment(employment)
          }
        })
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
      .catch(function (err) {
        dispatch(
          error({
            // uid: 'once-please', // you can specify your own uid if required
            title: 'Fel',
            message: 'Det gick inte att spara anställningen',
            autoDismiss: 0,
            position: 'br',
            action: {
              label: 'Försök igen',
              callback: () => updateEmployment(employment)
            }
          })
        )
        console.log(err.response)
      })
      .then((result) => {
        return dispatch({
          type: UPDATE_EMPLOYMENT,
          employment: result.data,
        })
      })
  }
}

export function removeEmployment (employment) {
  return dispatch => {
    return apiClient.delete('me/employments/' + employment.id + '/')
      .then((result) => {
        return dispatch({
          type: REMOVE_EMPLOYMENT,
          id: employment.id
        })
      })
      .catch(function (error) {
        error({
          // uid: 'once-please', // you can specify your own uid if required
          title: 'Fel',
          message: 'Det gick inte att ta bort anställningen',
          autoDismiss: 0,
          position: 'br',
          action: {
            label: 'Försök igen',
            callback: () => removeEmployment(employment)
          }
        })
        console.log(error)
      })
  }
}
