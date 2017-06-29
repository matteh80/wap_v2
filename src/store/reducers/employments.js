const {
  EMPLOYMENTS_FAIL,
  GET_ALL_EMPLOYMENTS,
  CREATE_EMPLOYMENT,
  REMOVE_EMPLOYMENT
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

    case REMOVE_EMPLOYMENT:
      let index = state.employments.findIndex(employments => employments.id === action.id)
      console.log(index)
      // employment item not found in state object so return original state
      if (index === -1) return state

      // employment item found! don't include it in the new state
      return {
        employments: [
          ...state.employments.slice(0, index),
          ...state.employments.slice(index + 1)
        ],
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
