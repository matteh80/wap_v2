import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'

import auth from './reducers/auth'
import profile from './reducers/profile'
import employments from './reducers/employments'
import occupations from './reducers/occupations'
import educations from './reducers/educations'
import skills from './reducers/skills'

export const makeRootReducer = (asyncReducers) => {
  return combineReducers({
    routing: routerReducer,
    auth: auth,
    profile: profile,
    employments: employments,
    occupations: occupations,
    educations: educations,
    skills: skills,
    ...asyncReducers
  })
}

export const injectReducer = (store, { key, reducer }) => {
  if (Object.hasOwnProperty.call(store.asyncReducers, key)) return

  store.asyncReducers[key] = reducer
  store.replaceReducer(makeRootReducer(store.asyncReducers))
}

export default makeRootReducer
