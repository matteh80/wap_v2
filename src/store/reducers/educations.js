const {
  EDUCATIONS_FAIL,
  GET_ALL_EDUCATIONS,
  CREATE_EDUCATION,
  REMOVE_EDUCATION
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

    case REMOVE_EDUCATION:
      let index = state.educations.findIndex(educations => educations.id === action.id)
      console.log(index)
      // education item not found in state object so return original state
      if (index === -1) return state

      // education item found! don't include it in the new state
      return {
        educations: [
          ...state.educations.slice(0, index),
          ...state.educations.slice(index + 1)
        ],
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
