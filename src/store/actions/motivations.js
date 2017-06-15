import { apiClient } from '../axios.config'
import axios from 'axios'

const {
  MOTIVATIONS_FAIL,
  GET_ALL_MOTIVATIONS,
  GET_MY_MOTIVATIONS,
  ADD_MOTIVATION,
  REMOVE_MOTIVATION,
  SAVE_MOTIVATIONS
} = require('./actionTypes/motivations')

export function getAllMotivations () {
  return (dispatch, getState) => {
    return apiClient.get('motivations').then((result) => {
      return dispatch({
        type: GET_ALL_MOTIVATIONS,
        motivations: result.data,
        receivedAt: Date.now()
      })
    })
      .catch(function (error) {
        return dispatch({
          type: MOTIVATIONS_FAIL,
          error: error.text,
          receivedAt: Date.now()
        })
      })
  }
}

export function getMyMotivations () {
  return (dispatch, getState) => {
    return apiClient.get('me/motivations')
      .then((result) => {
        return dispatch({
          type: GET_MY_MOTIVATIONS,
          userMotivations: result.data,
          receivedAt: Date.now()
        })

      })
  }
}

export function removeMotivation (id) {
  return {
    type: REMOVE_MOTIVATION,
    id: id
  }
}

export function addMotivation (motivation) {
  return {
    type: ADD_MOTIVATION,
    motivation: motivation
  }
}

export function saveMotivationsToServer (motivations) {
  console.log(motivations)
  return (dispatch, getState) => {
    return apiClient.post('me/motivations/', motivations).then((result) => {
      console.log(result)
      return dispatch({
        type: SAVE_MOTIVATIONS,
        userMotivations: result.data,
        receivedAt: Date.now()
      })
    })
      .catch(function (error) {
        return dispatch({
          type: MOTIVATIONS_FAIL,
          error: error.text,
          receivedAt: Date.now()
        })
      })
  }
}
