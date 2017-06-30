const {
  REFERENCES_FAIL,
  GET_ALL_REFERENCES,
  CREATE_REFERENCE,
  REMOVE_REFERENCE
} = require('../actions/actionTypes/references')

let index = -1

function references (state = [], action) {
  if (action.error) {
    return {
      result: state.result,
      error: action.error
    }
  }
  switch (action.type) {
    case GET_ALL_REFERENCES:
      return {
        receivedAt: action.receivedAt,
        ...action
      }

    case CREATE_REFERENCE:
      return {
        ...state,
        ...action
      }

    case REMOVE_REFERENCE:
      let index = state.references.findIndex(references => references.id === action.id)
      console.log(index)
      // reference item not found in state object so return original state
      if (index === -1) return state

      // reference item found! don't include it in the new state
      return {
        references: [
          ...state.references.slice(0, index),
          ...state.references.slice(index + 1)
        ],
      }

    case REFERENCES_FAIL:
      return {
        ...action
      }
    default:
      return state
  }
}

export default references
