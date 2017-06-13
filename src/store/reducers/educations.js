const {
  EDUCATIONS_FAIL,
  GET_ALL_EDUCATIONS,
  CREATE_EDUCATION
} = require('../actions/actionTypes/educations')

let index = -1

function educations (state = [], action) {
  if (action.error) {
    return {
      result: state.result,
      error: action.error
    }
  }
  switch (action.type) {
    case GET_ALL_EDUCATIONS:
      return {
        receivedAt: action.receivedAt,
        ...action
      }

    case CREATE_EDUCATION:
      return {
        ...state,
        ...action
      }

    case EDUCATIONS_FAIL:
      return {
        ...action
      }
    default:
      return state
  }
}

export default educations
