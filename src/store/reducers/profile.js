const {
  GET_PROFILE
} = require('../actions/actionTypes/profile')

function profile (state = {}, action) {
  if (action.error) {
    return {
      result: state.result,
      error: action.error
    }
  }
  switch (action.type) {
    case GET_PROFILE:
      console.log(state)
      return {
        ...state,
        ...action
      }
    default:
      return state
  }
}

export default profile
