const {
  EMPLOYMENTS_FAIL,
  GET_ALL_EMPLOYMENTS
} = require('../actions/actionTypes/employments')

function employments (state = [], action) {
  if (action.error) {
    return {
      result: state.result,
      error: action.error
    }
  }
  switch (action.type) {
    case GET_ALL_EMPLOYMENTS:
      return {
        receivedAt: action.receivedAt,
        ...action
      }
    default:
      return state
  }
}

export default employments
