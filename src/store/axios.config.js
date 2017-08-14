import axios from 'axios'
import { getStore } from './createStore'

let instance = axios.create()
instance.defaults.baseURL = 'https://api.wapcard.se/api/v1/'
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
