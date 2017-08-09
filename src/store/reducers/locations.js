const {
  GET_ALL_LOCATIONS,
  GET_MY_LOCATIONS,
  ADD_LOCATION,
  REMOVE_LOCATION,
  SAVE_LOCATIONS,
  REVERT_CHANGES
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
      let mLocations = setUpLocations(action.locations, action.userLocations)
      return {
        ...state,
        receivedAt: action.receivedAt,
        locations: mLocations,
        userLocations: action.userLocations
      }

    case GET_MY_LOCATIONS:
      return {
        ...state,
        receivedAt: action.receivedAt,
        ...action
      }

    case ADD_LOCATION:
      let i = state.userLocations.findIndex(userLocations => userLocations.id === action.location.id)

      if (i === -1) {
        let newLocation = { 'id':action.location.id, 'name':action.location.name, 'parent_name': action.location.parent_name, isChecked: true }
        let mUserLocations = Object.assign([], state.userLocations)
        mUserLocations.push(newLocation)
        let mLocations = setUpLocations(Object.assign([], state.locations), mUserLocations)
        return {
          ...state,
          userLocations: mUserLocations,
          locations: mLocations
        }
      } else {
        return state
      }

    case REMOVE_LOCATION:
      let index = state.userLocations.findIndex(userLocations => userLocations.id === action.location.id)

      if (index === -1) {
        return state
      }

      let mUserLocations = Object.assign([], state.userLocations)
      mUserLocations = mUserLocations.filter(mUserLocations => mUserLocations.id !== action.location.id)
      let rLocations = setUpLocations(Object.assign([], state.locations), mUserLocations)

      return {
        ...state,
        userLocations: mUserLocations,
        locations: rLocations
      }

    case SAVE_LOCATIONS:
      return {
        ...state,
        receivedAt: action.receivedAt,
        ...action
      }

    case REVERT_CHANGES:
      let iLocations = setUpLocations(Object.assign([], state.locations), action.userLocations)

      return {
        ...state,
        userLocations: action.userLocations,
        locations: iLocations
      }

    default:
      return state
  }
}

export default locations

function setUpLocations (input, userLocations) {
  let locations = []

  let index = -1
  for (let [key, value] of entries(input)) {
    // console.log(value.municipalities)
    let municipalities = []
    value.municipalities.map((loc) => {
      index = userLocations.findIndex(userLocations => userLocations.id === loc.id)
      if (index > -1) {
        municipalities.push(Object.assign({}, loc, {
          isChecked: true,
        }))
      } else {
        municipalities.push(Object.assign({}, loc, {
          isChecked: false,
        }))
      }
    })
    locations.push(Object.assign({}, value, {
      municipalities: municipalities,
    }))
  }
  return locations
}

function * entries (obj) {
  for (let key of Object.keys(obj)) {
    yield [key, obj[key]]
  }
}
