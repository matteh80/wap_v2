import { apiClient } from '../axios.config'

const {
  REFERENCES_FAIL,
  GET_ALL_REFERENCES,
  CREATE_REFERENCE,
  UPDATE_REFERENCE,
  REMOVE_REFERENCE
} = require('./actionTypes/references')

export function getAllReferences () {
  return (dispatch, getState) => {
    return apiClient.get('me/references/').then((result) => {
      return dispatch({
        type: GET_ALL_REFERENCES,
        references: result.data,
        receivedAt: Date.now()
      })
    })
      .catch(function (error) {
        return dispatch({
          type: REFERENCES_FAIL,
          error: error.text,
          receivedAt: Date.now()
        })
      })
  }
}

export function createReference (reference) {
  return (dispatch, getState) => {
    return apiClient.post('me/references/',
      reference
    ).then((result) => {
      return dispatch({
        type: CREATE_REFERENCE
      })
    })
      .catch(function (error) {
        return dispatch({
          type: REFERENCES_FAIL,
          error: error.text,
          receivedAt: Date.now()
        })
      })
  }
}

export function updateReference (reference) {
  return dispatch => {
    return apiClient.put('me/references/' + reference.id + '/',
      reference
    )
      .then((result) => {
        return dispatch({
          type: UPDATE_REFERENCE,
          reference: result.data,
        })
      })
      .catch(function (error) {
        console.log(error)
      })
  }
}

export function removeReference (reference) {
  return dispatch => {
    return apiClient.delete('me/references/' + reference.id + '/')
      .then((result) => {
        return dispatch({
          type: REMOVE_REFERENCE,
          id: reference.id
        })
      })
      .catch(function (error) {
        console.log(error)
      })
  }
}
