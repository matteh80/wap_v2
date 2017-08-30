import { apiClient } from '../axios.config'
import {
  GET_ALL_SHARES,
  CREATE_SHARE,
  DELETE_SHARE
} from './actionTypes/shareprofile'

export function getAllShares () {
  return (dispatch, getState) => {
    return apiClient.get('me/temporary-links/').then((result) => {
      console.log(result)
      return dispatch({
        type: GET_ALL_SHARES,
        shares: result.data,
        receivedAt: Date.now()
      })
    })
  }
}

export function createShare (name, ttl) {
  return (dispatch, getState) => {
    return apiClient.post('me/temporary-links/',
      {
        name: name,
        ttl: ttl
      }
    ).then((result) => {
      return dispatch({
        type: CREATE_SHARE,
        share: result.data,
        receivedAt: Date.now()
      })
    })
  }
}

export function deleteShare (id) {
  return (dispatch, getState) => {
    return apiClient.delete('me/temporary-links/' + id).then((result) => {
      return dispatch({
        type: DELETE_SHARE,
        shareId: id,
        receivedAt: Date.now()
      })
    })
  }
}
