const {
  OCCUPATIONS_FAIL,
  GET_ALL_OCCUPATIONS
} = require('../actions/actionTypes/occupations')

function occupations (state = [], action) {
  if (action.error) {
    return {
      result: state.result,
      error: action.error
    }
  }
  switch (action.type) {
    case GET_ALL_OCCUPATIONS:
      return {
        receivedAt: action.receivedAt,
        ...action
      }

    case OCCUPATIONS_FAIL:
      return {
        ...action
      }
    default:
      return state
  }
}

export default occupations
