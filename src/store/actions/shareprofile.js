import { apiClient } from '../axios.config'
import {
  GET_ALL_SHARES,
  CREATE_SHARE
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
