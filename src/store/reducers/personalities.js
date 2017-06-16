const {
  PERSONALITIES_FAIL,
  GET_ALL_PERSONALITIES,
  GET_MY_PERSONALITIES,
  ADD_PERSONALITY,
  REMOVE_PERSONALITY,
  SAVE_PERSONALITIES
} = require('../actions/actionTypes/personalities')

function personalities (state = [], action) {
  if (action.error) {
    return {
      result: state.result,
      error: action.error
    }
  }
  switch (action.type) {
    case GET_ALL_PERSONALITIES:
      return {
        ...state,
        receivedAt: action.receivedAt,
        ...action
      }

    case GET_MY_PERSONALITIES:
      return {
        ...state,
        receivedAt: action.receivedAt,
        ...action
      }

    case ADD_PERSONALITY:
      return Object.assign({}, state, {
        userPersonalities: [
          ...state.userPersonalities,
          {
            id: action.personality.id,
            name: action.personality.name,
            parent_name: action.personality.parent_name
          }
        ]
      })

    case REMOVE_PERSONALITY:
      console.log(action)
      console.log(state)
      return {
        userPersonalities: state.userPersonalities.filter(userPersonalities => userPersonalities.id !== action.id)
      }

    case SAVE_PERSONALITIES:
      return {
        ...state,
        receivedAt: action.receivedAt,
        ...action
      }

    case PERSONALITIES_FAIL:
      return {
        ...action
      }
    default:
      return state
  }
}

export default personalities
