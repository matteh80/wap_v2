import { REHYDRATE } from 'redux-persist/constants'

const {
  LOGIN,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT,
  LOGOUT_SUCCESS,
  LOGOUT_FAIL
} = require('../actions/actionTypes/auth')

let nestedKey = 'blacklisted'
let getNestedKey = () => nestedKey

const initialState = {
  loaded: false
}
export default function reducer (state = initialState, action = {}) {
  switch (action.type) {
    case LOGIN:
      return {
        ...state,
        loggingIn: true
      }
    case LOGIN_SUCCESS:
      console.log('login success')
      return {
        ...state,
        loggingIn: false,
        ...action
      }
    case LOGIN_FAIL:
      return {
        ...state,
        loggingIn: false,
        user: null,
        loginError: action.error
      }
    case LOGOUT:
      console.log('logout')
      return {
        ...state,
        loggingOut: true,
        token: null
      }
    case LOGOUT_SUCCESS:
      return {
        ...state,
        loggingOut: false,
        user: null
      }
    case LOGOUT_FAIL:
      return {
        ...state,
        loggingOut: false,
        logoutError: action.error
      }
    default:
      return state
  }
}
