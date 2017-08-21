import {
  GET_ALL_STORIES,
  GET_STORY,
  ADD_STORY,
  UPDATE_STORY,
  DELETE_STORY,
  GET_EVENT_TYPES,
  ADD_STORY_EVENT,
  GET_STORY_EVENTS
} from '../actions/actionTypes/wapstory'

function wapstory (state = [], action) {
  if (action.error) {
    return {
      stories: state.result,
      error: action.error,
    }
  }
  switch (action.type) {
    case GET_ALL_STORIES:
      return {
        ...state,
        ...action,
      }

    case GET_STORY:
      return {
        ...state,
        ...action,
      }

    case GET_EVENT_TYPES:
      return {
        ...state,
        ...action,
      }

    case GET_STORY_EVENTS:
      return {
        ...state,
        active_story: {
          ...state.active_story,
          ...action,
        }
      }

    case UPDATE_STORY:
      let index = state.stories.findIndex(stories => stories.id === action.id)
      if (index === -1) return state

      return {
        stories: [
          ...state.stories.slice(0, index),
          Object.assign({}, state.stories[index], action.stories),
          ...state.stories.slice(index + 1)
        ]
      }

    case DELETE_STORY:
      let dIndex = state.stories.findIndex(stories => stories.id === action.id)
      if (dIndex === -1) return state

      return {
        stories: [
          ...state.stories.slice(0, dIndex),
          ...state.stories.slice(dIndex + 1)
        ],
      }

    default:
      return state
  }
}

export default wapstory
