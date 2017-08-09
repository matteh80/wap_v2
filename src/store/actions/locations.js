import { apiClient } from '../axios.config'
import axios from 'axios'

const {
  GET_ALL_LOCATIONS,
  ADD_LOCATION,
  REMOVE_LOCATION,
  SAVE_LOCATIONS,
  REVERT_CHANGES
} = require('./actionTypes/locations')

export function addOrRemoveLocation (location) {
  return (dispatch, getState) => {
    return new Promise(resolve => {
      resolve()
    }).then(() => {
      let index = getState().locations.userLocations.findIndex(userLocations => userLocations.id === location.id)
      dispatch({
        type: index === -1 ? ADD_LOCATION : REMOVE_LOCATION,
        location: location
      })
    })
  }
}

export function getAllLocations () {
  return (dispatch, getState) => {
    return axios.all([getLocations(), getMyLocations()])
      .then(axios.spread(function (locations, userLocations) {
        dispatch({
          type: GET_ALL_LOCATIONS,
          locations: locations.data,
          userLocations: userLocations.data,
          receivedAt: Date.now()
        })
      }))
  }
}

function getLocations () {
  return apiClient.get('locations')
}

function getMyLocations () {
  return apiClient.get('me/locations')
}

export function saveLocationsToServer () {
  return (dispatch, getState) => {
    return apiClient.post('me/locations/', getState().locations.userLocations).then((result) => {
      console.log(result)
      return dispatch({
        type: SAVE_LOCATIONS,
        userLocations: result.data,
        receivedAt: Date.now()
      })
    })
      .catch(function (error) {
        console.log(error)
      })
  }
}

export function revertChanges (initalLocations) {
  return (dispatch) => {
    return new Promise(resolve => {
      resolve()
    }).then(() => {
      dispatch({
        type: REVERT_CHANGES,
        userLocations: initalLocations
      })
    })
  }
}
