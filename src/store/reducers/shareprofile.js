import {
  GET_ALL_SHARES,
  CREATE_SHARE,
  DELETE_SHARE
} from '../actions/actionTypes/shareprofile'

import _ from 'lodash'

function shares (state = [], action) {
  if (action.error) {
    return {
      result: state.result,
      error: action.error
    }
  }
  switch (action.type) {
    case GET_ALL_SHARES:
      return {
        receivedAt: action.receivedAt,
        ...action
      }

    case CREATE_SHARE:
      return {
        shares: _.concat(state.shares, action.share)
      }

    case DELETE_SHARE:
      return {
        shares: state.shares.filter(shares => shares.id !== action.shareId)
      }

    default:
      return state
  }
}

export default shares
