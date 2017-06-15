const {
  MOTIVATIONS_FAIL,
  GET_ALL_MOTIVATIONS,
  GET_MY_MOTIVATIONS,
  ADD_MOTIVATION,
  REMOVE_MOTIVATION,
  SAVE_MOTIVATIONS
} = require('../actions/actionTypes/motivations')

function motivations (state = [], action) {
  if (action.error) {
    return {
      result: state.result,
      error: action.error
    }
  }
  switch (action.type) {
    case GET_ALL_MOTIVATIONS:
      return {
        ...state,
        receivedAt: action.receivedAt,
        ...action
      }

    case GET_MY_MOTIVATIONS:
      return {
        ...state,
        receivedAt: action.receivedAt,
        ...action
      }

    case ADD_MOTIVATION:
      return Object.assign({}, state, {
        userMotivations: [
          ...state.userMotivations,
          {
            id: action.motivation.id,
            name: action.motivation.name,
            parent_name: action.motivation.parent_name
          }
        ]
      })

    case REMOVE_MOTIVATION:
      console.log(action)
      console.log(state)
      return {
        userMotivations: state.userMotivations.filter(userMotivations => userMotivations.id !== action.id)
      }

    case SAVE_MOTIVATIONS:
      return {
        ...state,
        receivedAt: action.receivedAt,
        ...action
      }

    case MOTIVATIONS_FAIL:
      return {
        ...action
      }
    default:
      return state
  }
}

export default motivations
