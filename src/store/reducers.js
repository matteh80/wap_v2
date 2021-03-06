import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'
import { localeReducer } from 'react-localize-redux'
import { reducer as notifications } from 'react-notification-system-redux'

import auth from './reducers/auth'
import profile from './reducers/profile'
import employments from './reducers/employments'
import occupations from './reducers/occupations'
import educations from './reducers/educations'
import skills from './reducers/skills'
import languages from './reducers/languages'
import motivations from './reducers/motivations'
import personalities from './reducers/personalities'
import wapfilm from './reducers/wapfilm'
import drivinglicenses from './reducers/drivinglicenses'
import references from './reducers/references'
import dreamjob from './reducers/dreamjob'
import jobs from './reducers/jobs'
import locations from './reducers/locations'
import talentq from './reducers/talentq'
import wapstory from './reducers/wapstory'
import shares from './reducers/shareprofile'

// export const makeRootReducer = (asyncReducers) => {
//   return combineReducers({
//     routing: routerReducer,
//     localeReducer: localeReducer,
//     auth: auth,
//     profile: profile,
//     employments: employments,
//     occupations: occupations,
//     educations: educations,
//     skills: skills,
//     languages: languages,
//     motivations: motivations,
//     personalities: personalities,
//     wapfilm: wapfilm,
//     drivinglicenses: drivinglicenses,
//     references: references,
//     dreamjob: dreamjob,
//     jobs: jobs,
//     ...asyncReducers
//   })
// }
//
// export const injectReducer = (store, { key, reducer }) => {
//   if (Object.hasOwnProperty.call(store.asyncReducers, key)) return
//
//   store.asyncReducers[key] = reducer
//   store.replaceReducer(makeRootReducer(store.asyncReducers))
// }
//
// export default makeRootReducer

const appReducer = combineReducers({
  routing: routerReducer,
  localeReducer: localeReducer,
  notifications: notifications,
  auth: auth,
  profile: profile,
  employments: employments,
  occupations: occupations,
  educations: educations,
  skills: skills,
  languages: languages,
  motivations: motivations,
  personalities: personalities,
  wapfilm: wapfilm,
  drivinglicenses: drivinglicenses,
  references: references,
  dreamjob: dreamjob,
  jobs: jobs,
  locations: locations,
  talentq: talentq,
  wapstory: wapstory,
  shares: shares
})
export const rootReducer = (state, action) => {
  if (action.type === 'auth/LOGOUT' || action.type === 'auth/LOGIN') {
    // state = undefined
    state = {
      routing: state.routing,
      localeReducer: state.localeReducer
    }
  }
  return appReducer(state, action)
}

export default rootReducer
