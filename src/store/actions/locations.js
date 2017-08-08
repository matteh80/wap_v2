import { apiClient } from '../axios.config'
import axios from 'axios'

const {
  GET_ALL_LOCATIONS,
  ADD_LOCATION,
  REMOVE_LOCATION
} = require('./actionTypes/locations')

export function addOrRemoveLocation (location) {
  return (dispatch, getState) => {
    console.log(getState())
    dispatch({
      type: ADD_LOCATION,
      location: location
    })
  }
}

export function getAllLocations () {
  return (dispatch, getState) => {
    return axios.all([getLocations(), getMyLocations()])
      .then(axios.spread(function (locations, userLocations) {
        let mLocations = setUpLocations(locations.data, userLocations.data)
        dispatch({
          type: GET_ALL_LOCATIONS,
          locations: mLocations,
          userLocations: userLocations.data,
          receivedAt: Date.now()
        })
      }))
  }
}

function getLocations () {
  return apiClient.get('locations')
}

export function getMyLocations () {
  return apiClient.get('me/locations')
}

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
