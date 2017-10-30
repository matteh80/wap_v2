import axios from 'axios'
import { getStore } from './createStore'

let instance = axios.create()
if (process.env.NODE_ENV === 'development') {
  // instance.defaults.baseURL = 'https://wapstage.leinfors.com/api/v1/'
  instance.defaults.baseURL = 'https://api.workandpassion.se/api/v1/'
} else {
  instance.defaults.baseURL = 'https://api.workandpassion.se/api/v1/'
}

instance.defaults.timeout = 60000

const store = getStore()
store.subscribe(listener)

function listener () {
  let token = store.getState().auth.token
  instance.defaults.headers = {
    'Authorization': 'Token ' + token
  }
}

instance.interceptors.request.use((config) => {
  if (config.url[config.url.length - 1] !== '/') {
    config.url += '/'
  }
  return config
})

export const apiClient = instance
