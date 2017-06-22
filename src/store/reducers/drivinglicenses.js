const {
  LICENSES_FAIL,
  GET_ALL_LICENSES,
  GET_MY_LICENSES,
  SAVE_LICENSES_TO_SERVER
} = require('../actions/actionTypes/drivinglicenses')

function drivinglicenses (state = [], action) {
  if (action.error) {
    return {
      result: state.result,
      error: action.error
    }
  }
  switch (action.type) {
    case GET_ALL_LICENSES:
      return {
        ...state,
        receivedAt: action.receivedAt,
        ...action
      }

    case GET_MY_LICENSES:
      return {
        ...state,
        receivedAt: action.receivedAt,
        ...action
      }

    case LICENSES_FAIL:
      return {
        ...action
      }
    default:
      return state
  }
}

export default drivinglicenses
