const {
  LANGUAGES_FAIL,
  GET_ALL_LANGUAGES,
  GET_MY_LANGUAGES,
  SAVE_LANGUAGES
} = require('../actions/actionTypes/languages')

function languages (state = [], action) {
  if (action.error) {
    return {
      result: state.result,
      error: action.error
    }
  }
  switch (action.type) {
    case GET_ALL_LANGUAGES:
      return {
        ...state,
        receivedAt: action.receivedAt,
        ...action
      }

    case GET_MY_LANGUAGES:
      return {
        ...state,
        receivedAt: action.receivedAt,
        ...action
      }

    case SAVE_LANGUAGES:
      return {
        ...state,
        receivedAt: action.receivedAt,
        ...action
      }

    case LANGUAGES_FAIL:
      return {
        ...action
      }
    default:
      return state
  }
}

export default languages
