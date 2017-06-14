const {
  OCCUPATIONS_FAIL,
  GET_ALL_OCCUPATIONS,
  GET_MY_OCCUPATIONS,
  ADD_OCCUPATION,
  REMOVE_OCCUPATION,
  ORDER_OCCUPATIONS,
  SAVE_OCCUPATIONS
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
        ...state,
        receivedAt: action.receivedAt,
        ...action
      }

    case GET_MY_OCCUPATIONS:
      return {
        ...state,
        receivedAt: action.receivedAt,
        ...action
      }

    case ADD_OCCUPATION:
      return Object.assign({}, state, {
        userOccupations: [
          ...state.userOccupations,
          {
            id: action.occupation.id,
            name: action.occupation.name,
            parent_name: action.occupation.parent_name
          }
        ]
      })

    case ORDER_OCCUPATIONS:
      return Object.assign({}, state, {
        userOccupations: action.occupations
      })

    case REMOVE_OCCUPATION:
      console.log(action)
      console.log(state)
      return {
        userOccupations: state.userOccupations.filter(userOccupations => userOccupations.id !== action.id)
      }

    case SAVE_OCCUPATIONS:
      return {
        ...state,
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
