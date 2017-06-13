const {
  EMPLOYMENTS_FAIL,
  GET_ALL_EMPLOYMENTS,
  CREATE_EMPLOYMENT
} = require('../actions/actionTypes/employments')

let index = -1

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

    case CREATE_EMPLOYMENT:
      return {
        ...state,
        ...action
      }

    case EMPLOYMENTS_FAIL:
      return {
        ...action
      }
    default:
      return state
  }
}

export default employments
