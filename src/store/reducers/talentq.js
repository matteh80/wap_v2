const {
  GET_TEST_STATUS,
} = require('../actions/actionTypes/talentq')

function talentq (state = [], action) {
  if (action.error) {
    return {
      result: state.result,
      error: action.error
    }
  }
  switch (action.type) {
    case GET_TEST_STATUS:
      return {
        ...state,
        receivedAt: action.receivedAt,
        ...action
      }

    default:
      return state
  }
}

export default talentq
