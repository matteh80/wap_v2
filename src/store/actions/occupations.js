import { apiClient } from '../axios.config'

const {
  OCCUPATIONS_FAIL,
  GET_ALL_OCCUPATIONS
} = require('./actionTypes/occupations')

export function getAllOccupations () {
  return (dispatch, getState) => {
    return apiClient.get('occupations').then((result) => {
      console.log(result)
      return dispatch({
        type: GET_ALL_OCCUPATIONS,
        occupations: result.data,
        receivedAt: Date.now()
      })
    })
      .catch(function (error) {
        return dispatch({
          type: OCCUPATIONS_FAIL,
          error: error.text,
          receivedAt: Date.now()
        })
      })
  }
}
