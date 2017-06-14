import { apiClient } from '../axios.config'

const {
  OCCUPATIONS_FAIL,
  GET_ALL_OCCUPATIONS,
  GET_MY_OCCUPATIONS,
  ADD_OCCUPATION,
  REMOVE_OCCUPATION,
  ORDER_OCCUPATIONS,
  SAVE_OCCUPATIONS
} = require('./actionTypes/occupations')

export function getAllOccupations () {
  return (dispatch, getState) => {
    return apiClient.get('occupations').then((result) => {
      console.log(result)
      return dispatch({
        type: GET_ALL_OCCUPATIONS,
        occupations: result.data,
        receivedAt: Date.now()
      })
    })
      .catch(function (error) {
        return dispatch({
          type: OCCUPATIONS_FAIL,
          error: error.text,
          receivedAt: Date.now()
        })
      })
  }
}

export function getMyOccupations () {
  return (dispatch, getState) => {
    return apiClient.get('me/occupations').then((result) => {
      console.log(result)
      return dispatch({
        type: GET_MY_OCCUPATIONS,
        userOccupations: result.data,
        receivedAt: Date.now()
      })
    })
      .catch(function (error) {
        return dispatch({
          type: OCCUPATIONS_FAIL,
          error: error.text,
          receivedAt: Date.now()
        })
      })
  }
}

export function orderOccupations (occupations) {
  return {
    type: ORDER_OCCUPATIONS,
    occupations
  }
}

export function removeOccupation (id) {
  return {
    type: REMOVE_OCCUPATION,
    id: id
  }
}

export function addOccupation (occupation) {
  return {
    type: ADD_OCCUPATION,
    occupation: occupation
  }
}

export function saveOccupationsToServer (occupations) {
  console.log(occupations)
  return (dispatch, getState) => {
    return apiClient.post('me/occupations/', occupations).then((result) => {
      console.log(result)
      return dispatch({
        type: SAVE_OCCUPATIONS,
        userOccupations: result.data,
        receivedAt: Date.now()
      })
    })
      .catch(function (error) {
        return dispatch({
          type: OCCUPATIONS_FAIL,
          error: error.text,
          receivedAt: Date.now()
        })
      })
  }
}
