const {
  UPLOAD_VIDEO,
  GET_VIDEO_INFO,
  REMOVE_VIDEO,
} = require('../actions/actionTypes/wapfilm')

function wapfilm (state = [], action) {
  switch (action.type) {
    case GET_VIDEO_INFO:
      return {
        ...action,
      }

    case UPLOAD_VIDEO:
      return {
        ...action
      }

    default:
      return state
  }
}

export default wapfilm
