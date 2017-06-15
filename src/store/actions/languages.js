import { apiClient } from '../axios.config'

const {
  LANGUAGES_FAIL,
  GET_ALL_LANGUAGES,
  GET_MY_LANGUAGES,
  SAVE_LANGUAGES
} = require('./actionTypes/languages')

export function getAllLanguages () {
  return (dispatch, getState) => {
    return apiClient.get('languages').then((result) => {
      return dispatch({
        type: GET_ALL_LANGUAGES,
        languages: result.data,
        receivedAt: Date.now()
      })
    })
      .catch(function (error) {
        return dispatch({
          type: LANGUAGES_FAIL,
          error: error.text,
          receivedAt: Date.now()
        })
      })
  }
}

export function getMyLanguages () {
  return (dispatch, getState) => {
    return apiClient.get('me/languages')
      .then((result) => {
        return dispatch({
          type: GET_MY_LANGUAGES,
          userLanguages: result.data,
          receivedAt: Date.now()
        })

      })
  }
}

export function saveLanguagesToServer (languages) {
  console.log(languages)
  return (dispatch, getState) => {
    return apiClient.post('me/languages/', languages).then((result) => {
      console.log(result)
      return dispatch({
        type: SAVE_LANGUAGES,
        userLanguages: result.data,
        receivedAt: Date.now()
      })
    })
      .catch(function (error) {
        return dispatch({
          type: LANGUAGES_FAIL,
          error: error.text,
          receivedAt: Date.now()
        })
      })
  }
}
