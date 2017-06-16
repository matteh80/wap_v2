import { apiClient } from '../axios.config'
import axios from 'axios'

const {
  PERSONALITIES_FAIL,
  GET_ALL_PERSONALITIES,
  GET_MY_PERSONALITIES,
  ADD_PERSONALITY,
  REMOVE_PERSONALITY,
  SAVE_PERSONALITIES
} = require('./actionTypes/personalities')

export function getAllPersonalities () {
  return (dispatch, getState) => {
    return apiClient.get('personalities').then((result) => {
      return dispatch({
        type: GET_ALL_PERSONALITIES,
        personalities: result.data,
        receivedAt: Date.now()
      })
    })
      .catch(function (error) {
        return dispatch({
          type: PERSONALITIES_FAIL,
          error: error.text,
          receivedAt: Date.now()
        })
      })
  }
}

export function getMyPersonalities () {
  return (dispatch, getState) => {
    return apiClient.get('me/personalities')
      .then((result) => {
        return dispatch({
          type: GET_MY_PERSONALITIES,
          userPersonalities: result.data,
          receivedAt: Date.now()
        })

      })
  }
}

export function removePersonality (id) {
  return {
    type: REMOVE_PERSONALITY,
    id: id
  }
}

export function addPersonality (personality) {
  return {
    type: ADD_PERSONALITY,
    personality: personality
  }
}

export function savePersonalitiesToServer (personalities) {
  console.log(personalities)
  return (dispatch, getState) => {
    return apiClient.post('me/personalities/', personalities).then((result) => {
      console.log(result)
      return dispatch({
        type: SAVE_PERSONALITIES,
        userPersonalities: result.data,
        receivedAt: Date.now()
      })
    })
      .catch(function (error) {
        return dispatch({
          type: PERSONALITIES_FAIL,
          error: error.text,
          receivedAt: Date.now()
        })
      })
  }
}
