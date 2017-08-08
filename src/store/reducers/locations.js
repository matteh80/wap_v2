const {
  GET_ALL_LOCATIONS,
  GET_MY_LOCATIONS,
  ADD_LOCATION,
  REMOVE_LOCATION
} = require('../actions/actionTypes/locations')

function locations (state = [], action) {
  if (action.error) {
    return {
      result: state.result,
      error: action.error
    }
  }
  switch (action.type) {
    case GET_ALL_LOCATIONS:
      return {
        ...state,
        receivedAt: action.receivedAt,
        ...action
      }

    case GET_MY_LOCATIONS:
      return {
        ...state,
        receivedAt: action.receivedAt,
        ...action
      }

    case ADD_LOCATION:
      let i = state.userLocations.findIndex(userLocations => userLocations.id === action.location.id)
      console.log(i)
      if (i === -1) {
        let newLocation = { 'id':action.location.id, 'name':action.location.name, 'parent_name': action.location.parent_name, 'isChecked':true }
        return {
          ...state,
          userLocations: [
            ...state.userLocations,
            newLocation,
          ]
        }
      } else {
        return state
      }

    default:
      return state
  }
}

export default locations
