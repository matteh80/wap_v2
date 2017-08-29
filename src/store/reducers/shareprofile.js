import {
  GET_ALL_SHARES,
  CREATE_SHARE
} from '../actions/actionTypes/shareprofile'

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
        ...state,
        ...action
      }

    default:
      return state
  }
}

export default shares
