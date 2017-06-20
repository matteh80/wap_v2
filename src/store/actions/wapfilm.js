import { apiClient } from '../axios.config'

const {
  UPLOAD_VIDEO,
  GET_VIDEO_INFO,
  REMOVE_VIDEO,
} = require('./actionTypes/wapfilm')

export function uploadVideo (videodata) {
  return (dispatch, getState) => {
    return apiClient.post('me/videos/',
      videodata, {
        onUploadProgress: function (progressEvent) {
          var percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total)
          console.log(percentCompleted)
        }
      }).then((result) =>
      dispatch({
        type: UPLOAD_VIDEO,
        video: result.data,
      })
    )
      .catch(function (error) {
        console.log(error)
      })
  }
}

export function getVideoInfo () {
  console.log('GET VIDE INFO')
  return (dispatch, getState) => {
    return apiClient.get('me/videos/')
      .then((result) => {
        dispatch({
          type: GET_VIDEO_INFO,
          video: result.data[0],
        })
      }
    )
      .catch(function (error) {
        console.log(error)
      })
  }
}

export function removeVideo (videoid) {
  return (dispatch, getState) => {
    return apiClient.delete('me/videos/' + videoid + '/')
      .then((result) => {
        dispatch({
          type: GET_VIDEO_INFO,
          video: null,
        })
      })
      .catch(function (error) {
        console.log(error)
      })
  }
}
