import {
  GET_ALL_STORIES,
  GET_STORY,
  ADD_STORY,
  UPDATE_STORY,
  DELETE_STORY,
  GET_EVENT_TYPES,
  ADD_STORY_EVENT,
  GET_STORY_EVENTS,
} from './actionTypes/wapstory'

import { apiClient } from '../axios.config'

export function getAllStories () {
  return (dispatch, getState) => {
    // if (getState().occupations.occupationresult) {
    //   return;
    // }
    return apiClient.get('https://api.wapcard.se/api/v1/me/stories/').then((result) => {
      // result.data.sort(function (a, b) {
      //   return a.start_date < b.start_date
      // })

      return dispatch({
        type: GET_ALL_STORIES,
        stories: result.data,
      })
    })
      .catch(function (error) {
        console.log(error)
      })
  }
}

export function getStory (storyId) {
  return (dispatch, getState) => {
    // if (getState().occupations.occupationresult) {
    //   return;
    // }
    return apiClient.get('https://api.wapcard.se/api/v1/me/stories/' + storyId).then((result) => {
      return dispatch({
        type: GET_STORY,
        active_story: result.data,
      })
    })
      .catch(function (error) {
        console.log(error)
      })
  }
}

export function addStory (story) {
  return dispatch => {
    return apiClient.post('https://api.wapcard.se/api/v1/me/stories/',
      story
    ).then((result) => {
      return result
    })
      .catch(function (error) {
        console.log(error)
      })
  }
}

export function updateStory (story) {
  return dispatch => {
    return apiClient.put('https://api.wapcard.se/api/v1/me/stories/' + story.id + '/',
      story
    ).then((result) => {
      return dispatch({
        type: UPDATE_STORY,
        stories: result.data,
      })
    })
      .catch(function (error) {
        console.log(error)
      })
  }
}

export function deleteStory (id) {
  return dispatch => {
    return apiClient.delete('https://api.wapcard.se/api/v1/me/stories/' + id + '/').then((result) => {
      dispatch({
        type: DELETE_STORY,
        result: result.data,
        id: id,
      })
      // console.log('deleted')
    })
      .catch(function (error) {
        console.log(error)
      })
  }
}

export function getEventTypes () {
  return (dispatch, getState) => {
    // if (getState().occupations.occupationresult) {
    //   return;
    // }
    return apiClient.get('https://api.wapcard.se/api/v1/stories/event-types/').then((result) => {
      return dispatch({
        type: GET_EVENT_TYPES,
        event_types: result.data,
      })
    })
      .catch(function (error) {
        console.log(error)
      })
  }
}

export function addStoryEvent (id, event) {
  return dispatch => {
    return apiClient.post('https://api.wapcard.se/api/v1/me/stories/' + id + '/events/',
      event
    ).then((result) => {
      return result
    })
      .catch(function (error) {
        console.log(error)
      })
  }
}

export function getStoryEvents (storyId) {
  return (dispatch, getState) => {
    // if (getState().occupations.occupationresult) {
    //   return;
    // }
    return apiClient.get('https://api.wapcard.se/api/v1/me/stories/' + storyId + '/events/').then((result) => {
      let newEvents = []
      result.data.map((event, index) => {
        index = getState().stories.event_types.findIndex(event_types => event_types.id === event.event_type)
        if (index > -1) {
          newEvents.push(Object.assign({}, event, {
            event_type_name: getState().stories.event_types[index].name,
          }))
        } else {
          newEvents.push(Object.assign({}, event, {

          }))
        }
      })

      newEvents.sort(function (a, b) {
        return a.date < b.date
      })

      return dispatch({
        type: GET_STORY_EVENTS,
        story_events: newEvents,
      })
    })
      .catch(function (error) {
        console.log(error)
      })
  }
}
